import Ember from "ember";
import Snippets from "../snippets";
import codeHighlightLinenums from "code-highlight-linenums";

/* global require */
var Highlight = self.require('highlight.js');

export default Ember.Component.extend({
  tagName: 'pre',
  classNameBindings: ['language'],
  classNames: ['code-snippet'],
  unindent: true,
  lineNumbers: false,

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
    const source = this._unindent(
      (Snippets[this.get('name')] || "")
        .replace(/^(\s*\n)*/, '')
        .replace(/\s*$/, '')
    );
    if (this.get('lineNumbers')) {
      const lang = this.get('language');
      return codeHighlightLinenums(source, {hljs:Highlight, lang, start:1 })
    }

    return source;

  }),

  didInsertElement: function(){
    if(!this.get('lineNumbers')) {
      Highlight.highlightBlock(this.get('element'));
    }
  },

  language: Ember.computed('name', function(){
    var m = /\.(\w+)$/i.exec(this.get('name'));
    if (m) {
      switch (m[1].toLowerCase()) {
      case 'js':
        return 'javascript';
      case 'coffee':
        return 'coffeescript';
      case 'hbs':
        return 'htmlbars';
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
      }
    }
  })
});
