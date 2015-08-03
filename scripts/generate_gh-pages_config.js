var fs = require('fs');
var version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
fs.writeFile(
  'build/gh-pages/_config.yml',
  "name: Traffico\nversion: "+version+"\nhighlighter: pygments\n",
  function(err) {
    if (err) throw err;
  }
);
console.log("Generated configuration for GitHub pages (v"+version+")!");
