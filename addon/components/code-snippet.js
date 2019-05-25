import layout from '../templates/components/code-snippet';
import Component from '@ember/component';
import { computed, get, defineProperty } from '@ember/object';
import { htmlSafe } from '@ember/template';

const Highlight = self.require('highlight.js');

const quoteForLanguage = {
  htmlbars: '"'
};

export default Component.extend({
  layout,
  tagName: 'pre',
  classNameBindings: ['language'],
  unindent: true,
  quote: computed('language', {
    get() {
      return quoteForLanguage[this.get('language')] || '\'';
    }
  }),

  _unindent(src) {
    if (!this.get('unindent')) {
      return src;
    }
    let match, min, lines = src.split("\n").filter(l => l !== '');
    for (let i = 0; i < lines.length; i++) {
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

  _dynamify(snippet) {
    let dynamicProperties = this.get('_dynamicProperties');
    Object.keys(dynamicProperties).forEach((property) => {
      let propertyValue = get(dynamicProperties, property);
      let type = typeof propertyValue;
      let quote = this.get('quote');

      let quotedValue = type === 'string' ? `${quote}${propertyValue}${quote}` : propertyValue;

      switch (this.get('language')) {
        case 'htmlbars':
          snippet = snippet.replace(
            new RegExp(`(<\\w*[^>]*\\s@[^=]+=){{${property}}}([^>]*>)`, 'g'),
            type === 'string' ? `$1${quotedValue}$2` : `$1{{${propertyValue}}}$2`
          );
          snippet = snippet.replace(new RegExp(`{{${property}}}`, 'g'), propertyValue);
          snippet = snippet.replace(new RegExp(`=${property}`, 'g'), `=${quotedValue}`);
          break;
        default:
          snippet = snippet.replace(new RegExp(`{{${property}}}`, 'g'), quotedValue);
      }
    });

    return snippet;
  },

  source: computed('name', '_dynamicProperties', function(){
    let snippet = this.get('name')
      .split('/')
      .reduce((dir, name) => dir && dir[name], this.snippets) || '';

    if (this.get('_dynamicProperties')) {
      snippet = this._dynamify(snippet);
    }

    return this._unindent(
      snippet
        .replace(/^(\s*\n)*/, '')
        .replace(/\s*$/, '')
    );
  }),

  highlight: computed('source', 'language', function() {
    let html = this.get('language')
      ? Highlight.highlight(this.get('language'), this.get('source')).value
      : Highlight.highlightAuto(this.get('source')).value;

    return htmlSafe(html);
  }),

  language: computed('name', {
    get() {
      let m = /\.(\w+)$/i.exec(this.get('name'));
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
    },
    set(key, value) {
      return value;
    }
  }),

  init() {
    this._super(...arguments);

    let dynamicProperties = this.get('dynamicProperties');
    if (dynamicProperties) {
      // define a property that gets updated correctly whenever any of the dynamic properties change
      // by passing all its keys as dependent keys of the CP
      defineProperty(
        this,
        '_dynamicProperties',
        computed(
          ...Object.keys(dynamicProperties).map(key => `dynamicProperties.${key}`),
          function() {
            return this.get('dynamicProperties');
          }
        )
      );
    }
  }
});
