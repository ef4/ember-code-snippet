/*jshint node: true */
'use strict';

var path = require('path');
var fs   = require('fs');
var mergeTrees = require('broccoli-merge-trees');
var browserify = require('broccoli-browserify');
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

  treeForVendor: function(tree){
    // Package up the highlight.js source from its node module.

    var src = this.treeGenerator(path.join(require.resolve('highlight.js'), '..', '..'));

    var highlight = browserify(src, {
      outputFile: 'browserified-highlight.js',
      require: [['./lib/index.js', {expose: 'highlight.js'}]]
    });
    return mergeTrees([highlight, tree]);
  },

  included: function(app) {
    app.import('vendor/browserified-highlight.js');
    app.import('vendor/highlight-style.css');
  }
};
