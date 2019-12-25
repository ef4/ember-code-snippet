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
      
      {{#with (get-code-snippet "render-test.js") as |snippet|}}
        <pre id="source"><code>{{snippet.source}}</code></pre>
        <div id="language">{{snippet.language}}</div>
        <div id="extension">{{snippet.extension}}</div>
      {{/with}}
    `);

    assert.strictEqual(
      this.element.querySelector('#source').textContent,
      'function sample(){\n  return 42;\n};'
    );
    assert.dom('#language').hasText('javascript'); // language is determined by file extension, so JS in this case
    assert.dom('#extension').hasText('js');
  });

  test('it returns snippet w/ indented source', async function(assert) {
    await render(hbs`
      // BEGIN-SNIPPET render-test
      function sample(){
        return 42;
      };
      // END-SNIPPET
      
      {{#with (get-code-snippet "render-test.js" unindent=false) as |snippet|}}
        <pre id="source"><code>{{snippet.source}}</code></pre>
        <div id="language">{{snippet.language}}</div>
        <div id="extension">{{snippet.extension}}</div>
      {{/with}}
    `);

    assert.strictEqual(
      this.element.querySelector('#source').textContent,
      '      function sample(){\n        return 42;\n      };'
    );
    assert.dom('#language').hasText('javascript'); // language is determined by file extension, so JS in this case
    assert.dom('#extension').hasText('js');
  });
});
