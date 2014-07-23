/*jshint node: true */
'use strict';

var path = require('path');
var fs   = require('fs');
var mergeTrees = require('broccoli-merge-trees');
var browserify = require('broccoli-browserify');
var flattenFolder = require('broccoli-spelunk');
var snippetFinder = require('./snippet-finder');

function CodeSnippet(project) {
  this.project = project;
  this.name    = 'Code Snippet Ember Component';
}

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}


CodeSnippet.prototype.treeFor = function treeFor(name) {
  var tree;
  var treePath = path.join('node_modules', 'ember-code-snippet', name + '-addon');

  if (fs.existsSync(treePath)) {
    tree = unwatchedTree(treePath);
  }

  if (name === 'app') {
    var snippets = snippetFinder('app');
    if (fs.existsSync('snippets')) {
      snippets = mergeTrees([snippets, 'snippets']);
    }
    snippets = flattenFolder(snippets, {
      outputFile: 'snippets.js',
      mode: 'es6',
      keepExtensions: true
    });
    tree = mergeTrees([tree, snippets]);
  }

  if (name === 'vendor') {
    // Package up the highlight.js source from its node module.
    var src = unwatchedTree(path.join('node_modules', 'ember-code-snippet', 'node_modules', 'highlight.js'));
    src = browserify(src, {
      outputFile: 'highlight.js',
      require: [['./lib/index.js', {expose: 'highlight.js'}]]
    });
    tree = mergeTrees([tree, src]);
  }
  return tree;
};

CodeSnippet.prototype.included = function included(app) {
  this.app = app;
  this.app.import('vendor/highlight.js');
  this.app.import('vendor/highlight-style.css');
};

module.exports = CodeSnippet;
