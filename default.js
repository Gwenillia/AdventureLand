class CodeLoader {
  constructor(basepPath, url) {
    this.basePath = basepPath;
    this.url = url;
  }

  #addScript(scriptContent) {
    const library = document.createElement("script");
    library.type = "text/javascript";
    library.text = scriptContent;
    document.getElementsByTagName("head")[0].appendChild(library);
  }

  #is_electron() {
    const userAgent = navigator.userAgent.toLowerCase();
    return (userAgent.indexOf(' electron/') > -1);
  }

  loadCode(fileName) {
    game_log("Loading " + fileName + "...")
    if (this.#is_electron()) {
      const fs = require('fs')
      const path = this.basePath + fileName;
      const data = fs.readFileSync(path, 'utf8');
      this.#addScript(data);
      return Promise.resolve();
    }
    else {
      const fileUrl = this.url + fileName;
      return fetch(fileUrl)
      .then(response => response.text())
      .then(scriptContent => this.#addScript(scriptContent));
    }
  }
}

const codeLoader = new CodeLoader("/path/to/directory/", "https://raw.githubusercontent.com/Gwenillia/AdventureLand/main/");

codeLoader.loadCode("main.js").then(() => {
  game_log("Loaded main.js");
}).catch((error) => {
  game_log("Error loading main.js: " + error.message);
});

