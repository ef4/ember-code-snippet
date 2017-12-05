/*jshint node: true */
'use strict';

var fs   = require('fs');
var mergeTrees = require('broccoli-merge-trees');
var flatiron = require('broccoli-flatiron');
var snippetFinder = require('./snippet-finder');
var findHost = require('./utils/findHost');

module.exports = {
  name: 'Code Snippet Ember Component',

  snippetPaths: function() {
    var app = findHost(this);
    return app.options.snippetPaths || ['snippets'];
  },

  snippetSearchPaths: function(){
    var app = findHost(this);
    return app.options.snippetSearchPaths || ['app'];
  },

  snippetRegexes: function() {
    var app = findHost(this);
    return [{
      begin: /\bBEGIN-SNIPPET\s+(\S+)\b/,
      end: /\bEND-SNIPPET\b/
    }].concat(app.options.snippetRegexes || []);
  },

  includeHighlightJS: function() {
    var app = findHost(this);
    if (typeof app.options.includeHighlightJS === 'boolean') {
      return app.options.includeHighlightJS;
    } else {
      return true;
    }
  },

  includeCodeHighlightLinenums: function() {
    var app = findHost(this);
    if (typeof app.options.includeCodeHighlightLinenums === 'boolean') {
      return app.options.includeCodeHighlightLinenums;
    } else {
      return true;
    }
  },

  includeHighlightStyle: function() {
    var app = findHost(this);
    if (typeof app.options.includeHighlightStyle === 'boolean') {
      return app.options.includeHighlightStyle;
    } else {
      return true;
    }
  },

  treeForApp: function(tree){
    var snippets = mergeTrees(this.snippetPaths().filter(function(path){
      return fs.existsSync(path);
    }));

    var snippetRegexes = this.snippetRegexes();
    snippets = mergeTrees(this.snippetSearchPaths().map(function(path){
      return snippetFinder(path, snippetRegexes);
    }).concat(snippets));

    snippets = flatiron(snippets, {
      outputFile: 'snippets.js'
    });

    return mergeTrees([tree, snippets]);
  },

  included: function(app) {
    if (this.includeHighlightJS()) {
      app.import('vendor/highlight.pack.js', { using: [
        { transformation: 'amd', as: 'highlight.js' }
      ] } );
    }
    if (this.includeHighlightStyle()) {
      app.import('vendor/highlight-style.css');
    }
    if (this.includeCodeHighlightLinenums()) {
      app.import('vendor/code-highlight-linenums.js');
    }
    app.import('vendor/shims/code-highlight-linenums.js');
  }
};
