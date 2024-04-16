class Utils {
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static deployAll(names) {
    names.forEach((name) => {
      start_character(name);
      log(name);
    });
  }
}

module.exports = Utils;
