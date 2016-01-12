var es = require('event-stream')

module.exports = resolveTransformations
function resolveTransformations () {
  var stream = es.map(function (file, cb) {
    if (file.isStream()) {
      this.emit('error', new Error('resolveTransformations() does not support streams!'))
      return cb()
    }
    if (file.isBuffer()) {
      var contents = JSON.parse(file.contents.toString('utf8'))
      // Iterate over the different signs
      for (var key in contents) {
        // Iterate over the "layers" of the sign
        for (var i in contents[key]['elements']) {
          // If this sign-element has transformations, resolve any transformation-variables
          if (contents[key]['elements'][i]['transform'] !== undefined) {
            contents[key]['elements'][i]['transform'] = resolveTransformationVariables(contents[key]['elements'][i]['transform'])
          }
        }
      }
      file.contents = new Buffer(JSON.stringify(contents), 'utf8')
    }
    cb(null, file)
  })
  return stream
}

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
function resolveTransformationVariables (string) {
  const TRANSFORMATIONS = require('../../build/transformations.json')
  var matches
  while (string != null && (matches = string.match(/\{[_a-z0-9]+\}/g))) {
    for (var i in matches) {
      if (TRANSFORMATIONS[matches[i].substr(1, matches[i].length - 2)] === undefined) {
        throw Error('Transformation ' + matches[i] + ' unknown!')
      }
      string = string.replace(
        matches[i],
        TRANSFORMATIONS[matches[i].substr(1, matches[i].length - 2)]
      )
    }
  }
  return string
}
