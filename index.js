/*jshint node: true */
'use strict';

var path = require('path');
var fs   = require('fs');
var mergeTrees = require('broccoli-merge-trees');
var flatiron = require('broccoli-flatiron');
var snippetFinder = require('./snippet-finder');

module.exports = {
  name: 'Code Snippet Ember Component',

  snippetPaths: function() {
    return this.app.options.snippetPaths || ['snippets'];
  },

  snippetSearchPaths: function(){
    return this.app.options.snippetSearchPaths || ['app'];
  },


  treeForApp: function(tree){
    var snippets= mergeTrees(this.snippetPaths().filter(function(path){
      return fs.existsSync(path);
    }));

    snippets = mergeTrees(this.snippetSearchPaths().map(function(path){
      return snippetFinder(path);
    }).concat(snippets));

    snippets = flatiron(snippets, {
      outputFile: 'snippets.js'
    });

    return mergeTrees([tree, snippets]);
  },

  treeForVendor: function(tree){
    // Package up the highlight.js source from its node module.

    var src = this.treeGenerator(path.join(require.resolve('highlight.js'), '..', '..'));

    return mergeTrees([src, tree]);
  },

  included: function(app) {
    app.import('vendor/highlight-style.css');
  }
};
