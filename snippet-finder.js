/* jshint node: true */
/* use strict */

var Plugin = require('broccoli-plugin');
var glob = require('glob');
var _Promise = require('es6-promise').Promise;
var fs = require('fs');
var path = require('path');


function findFiles(srcDir) {
  return new _Promise(function(resolve, reject) {
    glob(path.join(srcDir, "**/*.+(js|ts|coffee|html|hbs|md|css|sass|scss|less|emblem|yaml)"), function (err, files) {
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

function writeSnippets(files, outputPath, options) {
  files.forEach((filename) => {
    var regexes = options.snippetRegexes;
    var snippets = extractSnippets(fs.readFileSync(filename, 'utf-8'), regexes);
    for (var name in snippets) {
      var destFile = path.join(outputPath, name);
      var includeExtensions = options.includeExtensions;
      if (includeExtensions) {
        destFile += path.extname(filename);
      }
      fs.writeFileSync(destFile, snippets[name]);
    }
  });
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
  return findFiles(this.inputPaths[0]).then((files) => {
    writeSnippets(files, this.outputPath, this.options);
  });
};

module.exports = SnippetFinder;
