Code Snippet Ember Component
============================

This is an Ember component (and ember-cli addon) that lets you keep
your sample code snippets in their own directory tree and then render
them nicely in your app.

- Syntax highlighting thanks to [highlight.js](http://highlightjs.org/).
- ember-cli's auto-reload will pick up changes to any of the snippet files.
- the component uses file extensions to help highlight.js guess the
  right language (right now just for "js" and "hbs", but please send
  PRs for ones you want).

Install
-------

`npm install --save-dev ember-code-snippet`

Usage
-----

Create a new "snippets" directory at the top level of your ember-cli
application, and place the code snippets you'd like to render in their
own files inside it.

Then in one of your templates, you can do:

    {{code-snippet name="my-sample.js"}}

That will render the contents of "snippets/my-sample.js" and
syntax-highlight it.

