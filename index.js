const fs = require('fs');
const path = require('path');

const glob = require('glob');
const webpack = require('webpack');

const FILENAME_PATTERN = /\/([\w-_]+)\/index\.html?$/;

function filenameToComponentName({ filename, publicFolder }) {
  return filename.replace(`${publicFolder}/`, '').replace(/\/?index.html/, '') || 'index';
}

module.exports = function happoPluginGatsby({
  pageFilter = () => true,
  publicFolder = path.resolve(process.cwd(), 'public'),
} = {}) {
  return {
    customizeWebpackConfig: config => {
      const pageFilenames = glob.sync(path.join(publicFolder, '/**/index.html')).filter(pageFilter);
      if (!pageFilenames.length) {
        throw new Error(
          `No \`index.html\` files were found in ${publicFolder}. Make sure you run \`gatsby build\` first.`,
        );
      }

      console.log(`Found ${pageFilenames.length} Gatsby pages`);

      config.plugins.push(
        new webpack.DefinePlugin({
          HAPPO_GATSBY_PAGES: JSON.stringify(
            pageFilenames.map(filename => ({
              component: filenameToComponentName({
                filename,
                publicFolder,
              }),
              content: fs.readFileSync(filename, 'utf-8'),
            })),
          ),
        }),
      );
      return config;
    },

    publicFolders: [publicFolder],
    pathToExamplesFile: path.join(__dirname, 'happoExamples.js'),
  };
};
