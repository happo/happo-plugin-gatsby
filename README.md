# happo-plugin-gatsby

A [happo.io](https://github.com/enduire/happo.io) plugin making it easy to add
screenshot testing for [Gatsby](https://www.gatsbyjs.org/) projects.

## Installation

```
npm install --save-dev happo-plugin-gatsby
```

## Usage

First, add the following to your `.happo.js` configuration file:

```js
// .happo.js
const happoPluginGatsby = require('happo-plugin-gatsby');

module.exports = {
  // ...
  plugins: [
    happoPluginGatsby({
      pages: ['/', '/blog/', '/blog/how-we-do-things/'],
      // other options go here
    }),
  ],

  type: 'plain',
}
```

Then, add a call to `happo-plugin-gatsby/register` in `gatsby-browser.js`. This
will ensure that happo workers can navigate through your application.

```
// gatsby-browser.js
import 'happo-plugin-gatsby/register';
```

Additionally, if you want to speed up the gatsby build or if you're running
into errors from the happo.io API related to payloads being too large, you can
limit page creation to only the pages included in the happo run. Modify (or
create) `gatsby-node.js` so that it uses `happo-plugin-gatsby/filter`:

```
// gatsby-node.js
const { onCreatePage, createPageFilter } = require('happo-plugin-gatsby/filter');

exports.onCreatePage = ({ page, actions }) => {
  // The provided `onCreatePage` filter will filter out pages that aren't part
  // of the happo test suite
  onCreatePage({ page, actions });
});

exports.createPages = async ({ graphql, actions }) => {
  // The `createPageFilter` function will return a modified/proxied
  // `createPage` function that will ignore pages that aren't part of the happo
  // test suite
  const createPage = createPageFilter(actions.createPage);
  createPage({
    path: '/foo/',
    component: 'some/component/file',
  });
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
