import Ember from "ember";
import Snippets from "../snippets";

/* global require */
var Highlight = require('highlight.js');

export default Ember.Component.extend({
  tagName: 'pre',
  classNameBindings: ['language'],

  source: function(){
    return (Snippets[this.get('name')] || "").trim();
  }.property('name'),

  didInsertElement: function(){
    Highlight.highlightBlock(this.get('element'));
  },
  
  language: function(){
    var m = /\.(\w+)$/i.exec(this.get('name'));
    if (m) {
      switch (m[1].toLowerCase()) {
      case 'js':
        return 'javascript';
      case 'hbs':
        return 'handlebars';
      }
    }
  }.property('name')
});
