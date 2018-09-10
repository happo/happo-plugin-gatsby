# happo-plugin-gatsby

A [happo.io](https://github.com/enduire/happo.io) plugin for Gatsby.

## Usage

Add the following to your `.happo.js` configuration file:

```js
// .happo.js
const happoPluginGatsby = require('happo-plugin-gatsby');

module.exports = {
  // ...
  plugins: [
    happoPluginGatsby({
      // options go here
    }),
  ],

  type: 'plain',
}
```

The Gatsby plugin for Happo takes screenshots on pre-built Gatsby pages.
Therefore, before you run `happo run` you need to run a Gatsby build. Use the
[`INSTALL_CMD` environment
variable](https://github.com/enduire/happo.io#integrating-with-your-continuous-integration-ci-environment)
to tell Happo to build before screenshooting.  This could look something like
this (using Travis CI as an example):

```yaml
# .travis.yml
script:
- INSTALL_CMD="yarn build" yarn happo-ci
```

## Options

### `pageFilter`

By default, all Gatsby pages are included in the test suite. By providing a
filter function, you can exclude certain pages. Here's an example excluding all
"blog" pages:

```js
happoPluginGatsby({
  pageFilter: (pathToFile) => {
    if (/\/blog/.test(pathToFile)) {
      // exclude blog pages
      return false;
    }
    return true;
  },
});
```

### `publicFolder`

Use this option to override where Happo looks for pre-built Gatsby pages. The
default is `path.resolve(process.cwd(), 'public')`. Make sure to use an
absolute file path here.

```js
const path = require('path');

happoPluginGatsby({
  publicFolder: path.resolve(__dirname, 'custom-build'),
});
```
