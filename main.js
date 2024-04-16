codeLoader.loadCode("utils/Global.js")
  .then(() => codeLoader.loadCode("utils/Utils.js"))
  .then(() => codeLoader.loadCode("characters/Merchant.js"))
  .then(() => {
    const merchantErgolin = new Merchant("Ergolin")

    Utils.deployAll(groupMembers)


    setInterval(async () => {
      await merchantErgolin.sortInventory();
      await merchantErgolin.rotation()
    }, 10000);

  }).catch((error) => {
    console.error("Error loading: " + error.message);
});

function on_party_request(name) {

  console.log("%cAccepting party request from " + name, "color: purple");
  if(groupMembers.includes(name)) {
    console.log("Accepting party request from " + name);
    accept_party_request(name)
  }
}
