/* jshint node: true */
/* use strict */

var Plugin = require('broccoli-plugin');
var glob = require('glob');
var _Promise = require('es6-promise').Promise;
var fs = require('fs');
var path = require('path');


function findFiles(srcDir) {
  return new _Promise(function(resolve, reject) {
    glob(path.join(srcDir, "**/*.+(js|coffee|html|hbs|md|css|sass|scss|less|emblem|yaml)"), function (err, files) {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

function extractSnippets(fileContent, regexes) {
  var stack = [];
  var output = {};
  fileContent.split("\n").forEach(function(line){
    var top = stack[stack.length - 1];
    if (top && top.regex.end.test(line)) {
      output[top.name] = top.content.join("\n");
      stack.pop();
    }

    stack.forEach(function(snippet) {
      snippet.content.push(line);
    });

    var match;
    var regex = regexes.find(function(regex) {
      return match = regex.begin.exec(line);
    });

    if (match) {
      stack.push({
        regex: regex,
        name: match[1],
        content: []
      });
    }
  });
  return output;
}

function SnippetFinder(inputNode, options) {
  if (!(this instanceof SnippetFinder)) {
    return new SnippetFinder(inputNode, options);
  }

  Plugin.call(this, [inputNode], {
    name: 'SnippetFinder',
    annotation: `SnippetFinder output: ${options.outputFile}`,
    persistentOutput: options.persistentOutput,
    needCache: options.needCache,
  });

  this.options = options;
}

SnippetFinder.prototype = Object.create(Plugin.prototype);
SnippetFinder.prototype.constructor = SnippetFinder;

SnippetFinder.prototype.build = function() {
  var regexes = this.options.snippetRegexes;
  var includeExtensions = this.options.includeExtensions;

  return findFiles(this.inputPaths[0]).then((files) => {
    files.forEach(function(filename) {
      var snippets = extractSnippets(fs.readFileSync(filename, 'utf-8'), regexes);
      for (var name in snippets) {
        var destFile = path.join(this.outputPath, name);
        if (includeExtensions) {
          destFile += path.extname(filename);
        }
        fs.writeFileSync(destFile, snippets[name]);
      }
    });
  });
};

module.exports = SnippetFinder;
