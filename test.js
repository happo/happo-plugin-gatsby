const assert = require('assert');
const path = require('path');
const fs = require('fs');

const constructPlugin = require('./');

let publicFolder = path.resolve(__dirname, 'test');
let pageFilter;

const subject = () => constructPlugin({
  publicFolder,
  pageFilter,
});
assert.strictEqual(subject().publicFolders.length, 1);
assert.strictEqual(subject().publicFolders[0], path.resolve(process.cwd(), 'test'));

let webpackConfig = subject().customizeWebpackConfig({ plugins: [] });
let pages = JSON.parse(webpackConfig.plugins[0].definitions.HAPPO_GATSBY_PAGES);
assert.strictEqual(pages.length, 3);
assert.strictEqual(pages[0].component, 'foo/bar');
assert.strictEqual(pages[1].component, 'foo');
assert.strictEqual(pages[2].component, 'index');
assert.strictEqual(pages[2].content, 'index content\n');

// Verify that an exception is thrown when the list of pages is empty
pageFilter = () => false;
assert.throws(() => subject().customizeWebpackConfig({ plugins: [] }), /No.*files were found/);

// Verify that you can use the filter to exclude pages
pageFilter = (page) => /bar/.test(page);
webpackConfig = subject().customizeWebpackConfig({ plugins: [] });
pages = JSON.parse(webpackConfig.plugins[0].definitions.HAPPO_GATSBY_PAGES);
assert.strictEqual(pages.length, 1);
assert.strictEqual(pages[0].component, 'foo/bar');

// Verify that the examples file can be opened
console.log(subject().pathToExamplesFile);
assert.strictEqual(fs.existsSync(subject().pathToExamplesFile), true);
