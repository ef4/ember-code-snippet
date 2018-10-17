import Ember from "ember";
import Snippets from "../snippets";

/* global require */
// var Highlight = self.require('highlight.js');

export default Ember.Component.extend({
  tagName: 'pre',
  classNameBindings: ['language'],
  unindent: true,

  _unindent: function(src) {
    if (!this.get('unindent')) {
      return src;
    }
    var match, min, lines = src.split("\n").filter(l => l !== '');
    for (var i = 0; i < lines.length; i++) {
      match = /^[ \t]*/.exec(lines[i]);
      if (match && (typeof min === 'undefined' || min > match[0].length)) {
        min = match[0].length;
      }
    }
    if (typeof min !== 'undefined' && min > 0) {
      src = src.replace(new RegExp("^[ \t]{" + min + "}", 'gm'), "");
    }
    return src;
  },

  source: Ember.computed('name', function(){
    var snippet = this.get('name')
      .split('/')
      .reduce((dir, name) => dir && dir[name], Snippets);

    return this._unindent(
      (snippet || "")
        .replace(/^(\s*\n)*/, '')
        .replace(/\s*$/, '')
    );
  }),

  didInsertElement: function(){
    // Highlight.highlightBlock(this.get('element'));
  },

  language: Ember.computed('name', 'lang', function(){
    if (this.lang) return this.lang;

    var m = /\.(\w+)$/i.exec(this.get('name'));
    if (m) {
      switch (m[1].toLowerCase()) {
      case 'js':
        return 'javascript';
      case 'coffee':
        return 'coffeescript';
      case 'hbs':
        return 'handlebars';
      case 'css':
        return 'css';
      case 'scss':
        return 'scss';
      case 'less':
        return 'less';
      case 'emblem':
        return 'emblem';
      case 'ts':
        return 'typescript';
      default:
        return m[1].toLowerCase();
      }
    }
  })
});
