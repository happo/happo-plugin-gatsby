# happo-plugin-gatsby

A [happo.io](https://github.com/enduire/happo.io) plugin making it easy to add
screenshot testing for [Gatsby](https://www.gatsbyjs.org/) projects.

## Usage

Add the following to your `.happo.js` configuration file:

```js
// .happo.js
const happoPluginGatsby = require('happo-plugin-gatsby');

module.exports = {
  // ...
  plugins: [
    happoPluginGatsby({
      pages: ['/', '/blog', '/blog/how-we-do-things'],
      // other options go here
    }),
  ],

  type: 'plain',
}
```

## Options

### `pages`

By default, only the index page is included in the test suite. List all URLs
that you want to be part of the test suite in the `pages` array.

```js
happoPluginGatsby({
  pages: ['/', '/blog', '/about'],
});
```

### `outputDir`

Use this option to override where Happo stores the Gatby build. The default is
`'public'`.

```js
happoPluginGatsby({
  publicFolder: 'happo-public'
});
```
