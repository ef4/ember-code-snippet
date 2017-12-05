(function(root) {
	"use strict";

	function codeHighlightLinenums(code, opts) {
		opts = opts || {};
		var hljs = opts.hljs,
			lang = opts.lang,
			start = opts.start || 0;
		// prevent errors by hljs
		code = code || '';
		if(lang && /:/.test(lang)) {
			start = +lang.split(/:/)[1];
			lang = lang.split(/:/)[0];
		} else {
			start = +start;
		}
		
		if(hljs) {
			if(lang) {
				code = hljs.highlight(lang, code).value;
			} else {
				code = hljs.highlightAuto(code).value;
			}
		}

		if(start) {
			// move all closing spans to the previous line
			code = code.replace(/([\r\n]\s*)(<\/span>)/ig, '$2$1');

			// replace spans with line-wraps inside them
			code = cleanLineBreaks(code);

			code = code.split(/\r\n|\r|\n/);
			var max = (start + code.length).toString().length;

			code = code
				.map(function(line, i) {
					return '<span class="line width-' + max + '" start="' + (start + i) + '">' + line + '</span>';
				})
				.join('\n');
		}

		return code;
	}

	// Simplified parser that looks for opening & closing spans, and walks the tree.
	// If there are any unclosed spans when a newline is encountered, we close them on the previous line,
	// and copy them forward to the next line.
	function cleanLineBreaks(code) {
		var openSpans = [],
			matcher = /<\/?span[^>]*>|\r\n|\r|\n/ig,
			newline = /\r\n|\r|\n/,
			closingTag = /^<\//;

		return code.replace(matcher, function(match) {
			if(newline.test(match)) {
				if(openSpans.length) {
					return openSpans.map(function() { return '</span>' }).join('') + match + openSpans.join('');
				} else {
					return match;
				}
			} else if(closingTag.test(match)) {
				openSpans.pop();
				return match;
			} else {
				openSpans.push(match);
				return match;
			}
		});
	}

	(function(factory) {
		if(typeof define === 'function' && define.amd) {
			// AMD. Register as an anonymous module.
			define(factory)
		} else if(typeof exports === 'object') {
			/**
			 * Node. Does not work with strict CommonJS, but
			 * only CommonJS-like environments that support module.exports,
			 * like Node.
			 */
			module.exports = factory();
		} else {
			// Browser globals (root is window)
			root.codeHighlightLinenums = factory();
		}
	}(function() {
		/**
		 * Just return a value to define the module export.
		 * This example returns an object, but the module
		 * can return a function as the exported value.
		 */
		return codeHighlightLinenums;
	}))

})(this);
