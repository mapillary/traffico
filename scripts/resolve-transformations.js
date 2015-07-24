var fs = require('fs');

// Configuration (Input and output directory)
const JSON_DIR = './build/signs/';
const OUT_DIR = './build/signs-simple/';

// Reading in the map containing the transformations
const TRANSFORMATIONS = JSON.parse(fs.readFileSync('build/transformations.json', 'utf8'));

// Iterating over the JSON files containing the signs with transformation-variables like {center2tri}
var builtFiles = fs.readdir(JSON_DIR, function(err, files) {
  for (var f in files) {
    if (files[f].indexOf('.json', files[f].length - 5) !== -1) {
      // Reading the contents of the current JSON file
      var data = JSON.parse(fs.readFileSync(JSON_DIR + files[f], 'utf8'));
      //Iterate over the different signs
      for (var key in data) {
        // Iterate over the "layers" of the sign
        for (var i in data[key]['elements']) {
          // If this sign-element has transformations, try to resolve transformation-variables
          if (data[key]['elements'][i]['transform'] !== undefined) {
            data[key]['elements'][i]['transform'] =
                resolveTransformationVariables(data[key]['elements'][i]['transform']);
          }
        }
      }
      fs.writeFile(OUT_DIR+files[f], JSON.stringify(data), function(err) {
        if (err) throw err;
      });
    }
  }
});

/**
 * Takes a transformation-string like
 *   "translate(0,-25%) {center2tri} scale(.4) rotate(-30deg)"
 * and replaces any transformation-variables (in this case {center2tri})
 * by the values defined in the transformations.json file.
 * @param string the transformation-string to be processed
 * @return the input-string with all transformation-variables replaced (recursively)
 * @throws exception if the string contains a transformation-variable that is
 *   not defined in the transformations.json file
 */
function resolveTransformationVariables(string) {
  while (string != null && (matches = string.match(/\{[_a-z0-9]+\}/g))) {
    for (var i in matches) {
      if (
        TRANSFORMATIONS[matches[i].substr(1, matches[i].length - 2)]
        === undefined
      ) {
        throw "Transformation "+matches[i]+" unknown!";
      }
      string = string.replace(
        matches[i],
        TRANSFORMATIONS[matches[i].substr(1, matches[i].length - 2)]
      );
    }
  }
  return string;
}
