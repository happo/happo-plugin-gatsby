const { Writable } = require('stream');
const { spawn } = require('child_process');
const Archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

function zipFolderToBuffer(outputDir) {
  return new Promise((resolve, reject) => {
    const archive = new Archiver('zip');
    const stream = new Writable();
    const data = [];
    stream._write = (chunk, enc, done) => {
      data.push(...chunk);
      done();
    };
    stream.on('finish', () => {
      const buffer = Buffer.from(data);
      resolve(buffer);
    });
    archive.pipe(stream);
    archive.directory(outputDir, '');
    archive.on('error', reject);
    archive.finalize();
  });
}

module.exports = function happoPluginGatsby({
  pages = ['/'],
  outputDir = 'public',
} = {}) {
  return {
    generateStaticPackage: async () => {
      await new Promise((resolve, reject) => {
        rimraf.sync(outputDir);

        const spawned = spawn('node_modules/.bin/gatsby', ['build'], {
          stdio: 'inherit',
        });

        spawned.on('exit', code => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error('Failed to make static gatsby build'));
          }
        });
      });
      const indexPage = path.join(outputDir, 'index.html');
      const iframePage = path.join(outputDir, 'iframe.html');
      if (!fs.existsSync(indexPage)) {
        throw new Error(
          'Failed to make static gatsby build (missing index.html)',
        );
      }
      try {
        const indexContent = fs.readFileSync(indexPage, 'utf-8');
        fs.writeFileSync(
          iframePage,
          indexContent.replace(
            '<head>',
            `
            <head>
              <script>
                window.happoGatsbyPages = ${JSON.stringify(pages)}
              </script>
              <script src="/happo-gatsby-inject.js"></script>
          `,
          ),
        );

        const injectFile = path.join(__dirname, 'happo-gatsby-inject.js');
        fs.copyFileSync(
          injectFile,
          path.join(outputDir, 'happo-gatsby-inject.js'),
        );
        const buffer = await zipFolderToBuffer(
          path.join(process.cwd(), outputDir),
        );
        return buffer.toString('base64');
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
  };
};
