var version = JSON.parse(require('fs').readFileSync('package.json', 'utf8')).version;
require('fs').writeFile(
  'build/gh-pages/_config.yml',
  "name: Traffico\nversion: "+version+"\nhighlighter: pygments\n",
  "utf8",
  function(err, data) {
    if (err) {
      throw err;
    }
    console.log("Generated configuration for GitHub pages (v"+version+")!");
  }
);
