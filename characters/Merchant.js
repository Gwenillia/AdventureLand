class Merchant {
  constructor(name) {
    this.name = name;
    this.lastPosition = "";
    this.shopPosition = { x: -203, y: -93 };
    if (parent.entities["Weitro"]) {
      this.weitroPosition = { x: parent.entities["Weitro"].real_x, y: parent.entities["Weitro"].real_y };
    }
    this.awaitingResponse = false
  }

  #isPriorityItem(name) {
    return name.includes("hpot0") || name.includes("mpot0");
  }

  #delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  #moveToPosition(target) {
    xmove(target.x, target.y);
  }

  #nearTarget(target, threshold = 100) {
    return distance(character, target) < threshold;
  }

  #awaitResponse() {
    return new Promise((resolve) => {
      const handleMessage = m => {
        if (m.name === "Weitro" && m.message.slots) {
          this.awaitingResponse = false;
          resolve(m.message.slots);
        }
      };

      character.on("cm", handleMessage);
    });
  }

  async sortInventory() {
    const items = character.items;
    let didSwap;

    do {
      didSwap = false;
      for (let i = 0; i < items.length - 1; i++) {
        const currentIsPriority = items[i] && this.#isPriorityItem(items[i].name);
        const nextIsPriority = items[i + 1] && this.#isPriorityItem(items[i + 1].name);

        if (currentIsPriority && !nextIsPriority) {
          continue;
        }

        if ((!currentIsPriority && nextIsPriority) ||
          (items[i] && items[i + 1] && items[i].name > items[i + 1].name) ||
          (!items[i] && items[i + 1])) {
          swap(i, i + 1);
          await this.#delay(100);
          didSwap = true;

          [items[i], items[i + 1]] = [items[i + 1], items[i]];
        }
      }
    } while (didSwap);
  }

  async rotation() {
    log('rotation')
    if (is_moving(character)) return;
    log('not moving')

    let weitroNear = this.#nearTarget(this.weitroPosition, 100);
    let shopNear = this.#nearTarget(this.shopPosition, 10);

    if (shopNear) {
      log('shop near')
      this.lastPosition = "Shop";
      open_stand()
      
      await this.#delay(10000);

      close_stand()
      if (this.weitroPosition) {
        this.#moveToPosition(this.weitroPosition);
      } else {
        parent.travel_p("Weitro");
        log('traveling to weitro')
      }
    } else  if (weitroNear) {
      this.awaitingResponse = true;
      log('will send_cm')
      send_cm("Weitro", { want: "slots" });
      await this.#awaitResponse();

      this.lastPosition = "Weitro";
      this.weitroPosition = { x: parent.entities["Weitro"].real_x, y: parent.entities["Weitro"].real_y };
      this.#moveToPosition(this.shopPosition);
    } else {
      log('else')
      this.#moveToPosition(this.weitroPosition);
    }
  }
}

