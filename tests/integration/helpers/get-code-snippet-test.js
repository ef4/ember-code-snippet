import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | get-code-snippet', function(hooks) {
  setupRenderingTest(hooks);

  test('it returns snippet', async function(assert) {
    await render(hbs`
      // BEGIN-SNIPPET render-test
      function sample(){
        return 42;
      };
      // END-SNIPPET
      
      {{#let (get-code-snippet "render-test.js") as |snippet|}}
        <div id="source">{{snippet.source}}</div>
        <div id="language">{{snippet.language}}</div>
        <div id="extension">{{snippet.extension}}</div>
      {{/let}}
    `);

    assert.dom('#source').hasText('function sample(){\n  return 42;\n};');
    assert.dom('#language').hasText('javascript'); // language is determined by file extension, so JS ini this case
    assert.dom('#extension').hasText('js');
  });

  test('it returns snippet w/ intented source', async function(assert) {
    await render(hbs`
      // BEGIN-SNIPPET render-test
      function sample(){
        return 42;
      };
      // END-SNIPPET
      
      {{#let (get-code-snippet "render-test.js" unintent=false) as |snippet|}}
        <div id="source">{{snippet.source}}</div>
        <div id="language">{{snippet.language}}</div>
        <div id="extension">{{snippet.extension}}</div>
      {{/let}}
    `);

    assert.dom('#source').hasText('      function sample(){\n        return 42;\n      };');
    assert.dom('#language').hasText('javascript'); // language is determined by file extension, so JS ini this case
    assert.dom('#extension').hasText('js');
  });
});
