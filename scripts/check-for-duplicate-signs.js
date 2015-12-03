require('fs').readdir('./dev/', function (err, files) {
  if (err) {
    throw err
  }
  for (var f in files) {
    if (files[f].indexOf('.cson', files[f].length - 5) !== -1) {
      checkForDuplicateSigns('./dev/' + files[f])
    }
  }
})

function checkForDuplicateSigns (filename) {
  var signNames = []

  var rl = require('readline').createInterface({
    terminal: false,
    input: require('fs').createReadStream(filename)
  })

  rl.on('line', function (line) {
    if (line.length >= 1 && line.slice(0, 1) !== ' ') {
      signNames.push(line.replace(/^\s*'\s*(.*)\s*'\s*:\s*$/, '$1'))
    }
  })
  rl.on('close', function () {
    signNames = signNames.sort()
    var errors = []

    for (var i = 0; i < signNames.length - 1; i++) {
      if (signNames[i] === signNames[i + 1]) {
        errors.push(filename + ': ' + signNames[i] + ' is defined (at least) twice!')
      }
    }
    if (errors.length >= 1) {
      throw new Error('\n==========\n' + errors.join('\n') + '\n==========\n')
    }
  })
}
