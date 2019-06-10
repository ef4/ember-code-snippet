import { module, test } from 'qunit';
import { getCodeSnippet } from 'ember-code-snippet';

module('Unit | getCodeSnippet', function() {

  test('it returns snippet', async function(assert) {
    let snippet = getCodeSnippet('render-test.js');

    assert.equal(snippet.source, 'function sample(){\n  return 42;\n};');
    assert.equal(snippet.language, 'javascript');
    assert.equal(snippet.extension, 'js');
  });

  test('it returns snippet w/ intented source', async function(assert) {
    let snippet = getCodeSnippet('render-test.js', false);

    assert.equal(snippet.source, '      function sample(){\n        return 42;\n      };');
    assert.equal(snippet.language, 'javascript');
    assert.equal(snippet.extension, 'js');
  });
});
