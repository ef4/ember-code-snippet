import { module, test } from 'qunit';
import { getCodeSnippet } from 'ember-code-snippet';

module('Unit | getCodeSnippet', function() {

  test('it returns snippet', async function(assert) {
    let snippet = getCodeSnippet('render-test.js');

    assert.strictEqual(snippet.source, 'function sample(){\n  return 42;\n};');
    assert.strictEqual(snippet.language, 'javascript');
    assert.strictEqual(snippet.extension, 'js');
  });

  test('it returns snippet w/ indented source', async function(assert) {
    let snippet = getCodeSnippet('render-test.js', false);

    assert.strictEqual(snippet.source, '      function sample(){\n        return 42;\n      };');
    assert.strictEqual(snippet.language, 'javascript');
    assert.strictEqual(snippet.extension, 'js');
  });

  test('it returns handlebars snippet', async function(assert) {
    let snippet = getCodeSnippet('static.hbs');

    assert.ok(snippet.source.includes('<p>I am a <strong>handlebars</strong> template!</p>'));
    assert.strictEqual(snippet.language, 'handlebars');
    assert.strictEqual(snippet.extension, 'hbs');
  });
});
