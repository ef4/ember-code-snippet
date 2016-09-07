module.exports = {
  afterInstall: function() {
    return this.addAddonToProject('ember-browserify@^1.1.12');
  }
};
