# 2.0.0

 - BREAKING CHANGE: we used to include syntax highlighting support for *every* language supported by highlight.js.  This is hundreds of languages and it results in a lot of unused code. Starting in 2.0.0, we only include a small set of defaults that are likely relevant to Ember users, and provide the option to substitute your own custom build of highlight.js if you need a different set. See "Syntax Highlighting Language Support" in the README.

 - ENHANCEMENT: you can now disable the automatic inclusion of our default theme and provide one of the other highlight.js themes. See "Theming Support" in the README.

 - ENHANCEMENT: detect nested code snippets (PR #42 by @defreeman)

# 2.1.0

 - ENHANCEMENT: Add code line numbers with code-highlight-linenums
