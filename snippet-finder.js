/* jshint node: true */

var Writer = require('broccoli-writer');
var glob = require('glob');
var _Promise = require('es6-promise').Promise;
var fs = require('fs');
var path = require('path');


function findFiles(srcDir) {
  return new _Promise(function(resolve, reject) {
    glob(path.join(srcDir, "**/*.+(js|coffee|html|hbs|css|sass|scss|less|emblem)"), function (err, files) {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

function extractSnippets(fileContent, regexes) {
  var inside = false;
  var content = [];
  var output = {};
  var name;
  var regex;
  fileContent.split("\n").forEach(function(line){
    if (inside) {
      if (regex.end.test(line)) {
        inside = false;
        output[name] = content.join("\n");
        content = [];
      } else {
        content.push(line);
      }
    } else {
      var m;
      regex = regexes.find(function(regex) {
        return m = regex.begin.exec(line);
      });

      if (m) {
        inside = true;
        name = m[1];
      }
    }
  });
  return output;
}


function SnippetFinder(inputTree, snippetRegexes) {
  if (!(this instanceof SnippetFinder)) {
    return new SnippetFinder(inputTree, snippetRegexes);
  }
  this.inputTree = inputTree;
  this.snippetRegexes = snippetRegexes;
}

SnippetFinder.prototype = Object.create(Writer.prototype);
SnippetFinder.prototype.constructor = SnippetFinder;

SnippetFinder.prototype.write = function (readTree, destDir) {
  var regexes = this.snippetRegexes;

  return readTree(this.inputTree).then(findFiles).then(function(files){
    files.forEach(function(filename){
      var snippets = extractSnippets(fs.readFileSync(filename, 'utf-8'), regexes);
      for (var name in snippets){
        fs.writeFileSync(path.join(destDir, name)+path.extname(filename),
                         snippets[name]);
      }
    });
  });
};

module.exports = SnippetFinder;
