Code Snippet Ember Helper
============================

This is an Ember helper (and ember-cli addon) that lets you render
code snippets within your app. The code snippets can live in their own
dedicated files or you can extract blocks of code from your
application itself.

Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above
* Node.js v8 or above

Installation
------------------------------------------------------------------------------

```
ember install ember-code-snippet
```

Usage
------------------------------------------------------------------------------

### Defining snippets

There are two ways to store your code snippets. You can use either or
both together.

#### With separate snippet files

Create a new "snippets" directory at the top level of your ember-cli
application or addon, and place the code snippets you'd like to render in their
own files inside it. They will be identified by filename. So if you
create the file `snippets/sample-template.hbs`, you can embed it in a
template with:

```hbs
{{code-snippet name="sample-template.hbs"}}
```

You can choose to load snippet files from different paths by passing
an option to `new EmberApp` in your `ember-cli-build.js`:

```js
var app = new EmberApp({
  snippetPaths: ['snippets']
});
```

If you want to use snippets located in an addon's dummy application,
add the dummy app path to `snippetPaths`:

```js
var app = new EmberAddon({
  snippetPaths: ['tests/dummy/app']
});
```

#### From within your application source

In any file under your `app` tree, annotate the start and end of a
code snippet block by placing comments like this:

```js
// BEGIN-SNIPPET my-nice-example
function sample(){
  return 42;
};
// END-SNIPPET
```

The above is a Javascript example, but you can use any language's
comment format. We're just looking for lines that match
`/\bBEGIN-SNIPPET\s+(\S+)\b/` and `/\bEND-SNIPPET\b/`.

The opening comment must include a name. The helper will identify
these snippets using the names you specified plus the file extension
of the file in which they appeared. 

You can also define your own regex to find snippets. Just use the `snippetRegexes` option:

```js
var app = new EmberAddon({
 snippetRegexes: {
   begin: /{{#element-example\sname=\"(\S+)\"/,
   end: /{{\/element-example}}/,
 }
});
```

In the regex above everything in the `element-example` component block will be a snippet! Just make sure the first regex capture group is the name of the snippet.

You can choose which paths will be searched for inline snippets by
settings the snippetSearchPaths option when creating your application
in ember-cli-build.js:

```js
var app = new EmberApp({
  snippetSearchPaths: ['app', 'other']
});
```

By default, the file extension from the containing file will automatically be included in the snippet name. For instance, the example above has `BEGIN-SNIPPET my-nice-example` in the JS source, and is subsequently referenced as `"my-nice-example.js"`. To disable this behavior, use the `includeFileExtensionInSnippetNames` option:

```js
var app = new EmberApp({
  includeFileExtensionInSnippetNames: false
});
```

### Helper usage

After you have defined your snippets, you can use the `get-code-snippet` helper to get the snippet data
for rendering: `{{get-code-snippet "my-nice-example.js"}}`. The returned value will be a JavaScript object with the
following properties:

* `source`: the source code extracted from the given snippet
* `language`: the snippets language, following the naming conventions of the popular `prism.js` library, e.g. `handlebars` for Ember templates
* `extension`: the file extension of the file containing the given snippet

By default, the helper will try to unindent the code block by
removing whitespace characters from the start of each line until the
code bumps up against the edge. You can disable this with:

```hbs
{{get-code-snippet "my-nice-example.js" unindent=false}}
```

The following example will render a `<pre>` tag with a given code snippet:

```hbs
{{#let (get-code-snippet "static.hbs") as |snippet|}}
  <pre class={{snippet.language}}>{{snippet.source}}</pre>
{{/let}}
```

### Syntax Highlighting

This addon does not provide any syntax highlighting capabilities itself, but instead it is designed with composability 
in mind, so you can add highlighting capabilities with any highlighting library on top of the snippet extraction 
primitives of this addon. The following is an example of rendering a code snippet using code highlighting provided by the 
[ember-prism](https://github.com/shipshapecode/ember-prism) addon:

```hbs
{{#let (get-code-snippet "demo.hbs") as |snippet|}}
  <CodeBlock @language={{snippet.language}}>
    {{snippet.source}}
  </CodeBlock>
{{/let}}
```

If you want to show multiple snippets, it makes sense to extract that template code into a reusable component. In fact
previous versions of `ember-code-snippet` shipped a `code-snippet` component, that you can replace now with the new
helper and your highlighting library of choice. The following template-only component could replace the previously 
available component `<CodeSnippet @name="demo.hbs" />`, again using `ember-prism` in this case:

```hbs
{{!-- templates/components/code-snippet.hbs --}}
{{#let (get-code-snippet @name) as |snippet|}}
  <CodeBlock @language={{snippet.language}}>
    {{snippet.source}}
  </CodeBlock>
{{/let}}
```

### JavaScript usage

When you want to use the code snippet functionality from JavaScript, you can import the `getCodeSnippet` function like
this:

```js
import { getCodeSnippet } from 'ember-code-snippet';
```

Its call signature is similar to the helper invocation: `getCodeSnippet(name, unindent = true)`, and it returns the same
POJO as described above.


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).