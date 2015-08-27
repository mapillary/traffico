var fs = require('fs')

const JSON_DIR = './build/signs-simple/'
const VAR_VALUES = {
  speed_value: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 100, 110, 120, 130],
  us_speed_value: [5, 10, 15, 20, 25, 30, 35, 45, 50, 55, 60, 65, 70, 75, 80, 85]
}

var fileList = fs.readdir(JSON_DIR, function (err, files) {
  for (var f in files) {
    var globalObject = {}
    if (files[f].indexOf('.json', files[f].length - 5) !== -1) {
      var fileContent = fs.readFileSync(JSON_DIR + files[f], 'utf8')
      var data = JSON.parse(fileContent)

      for (var key in data) {
        var elements = data[key]['elements']
        var currentSign = '<span class="t">'
        for (var i in elements) {
          var typeOfVariableContent = undefined
          var content = ''

          // If the sign can have variable content…
          if (typeof VAR_VALUES[elements[i]['type']] != 'undefined') {
            // …add the placeholders "{{{length}}}" and "{{{variable}}}", which will be replaced later
            typeOfVariableContent = elements[i]['type']
            content = '{{{variable}}}'
            elements[i]['type'] = 'content{{{length}}}'
          } else if (typeof elements[i]['content'] !== 'undefined') {
            content = elements[i]['content']
          }

          var transform = ''
          if (elements[i]['transform']) {
            transform = ' style="-webkit-transform:' + elements[i]['transform'] +
              ';-moz-transform:' + elements[i]['transform'] +
              ';transform:' + elements[i]['transform'] + '"'
          }

          currentSign += '<i class="t-' + elements[i]['type'] + ' t-c-' + elements[i]['color'] + '"' + transform + '>' + content + '</i>';
        }
        currentSign += '</span>'

        var country = files[f].split('.')[0]
        var category = data[key].category
        var variation = ''
        var outputKey = ''

        if (data[key].variation) {
          variation = '--' + data[key].variation.split(' ').join('-')
        }

        if (typeOfVariableContent) {
          for (var i in VAR_VALUES[typeOfVariableContent]) {
            var val = String(VAR_VALUES[typeOfVariableContent][i])
            var len = val.length
            var replaced = currentSign.replace(/\{\{\{variable\}\}\}/g, val).replace(/\{\{\{length\}\}\}/g, len == 2 ? '' : '-' + len)
            outputKey = category + '--' + key.replace(/_v[0-9]$/g, '') + '-' + val + '--' + country + variation

            globalObject[outputKey] = replaced
          }
        } else {
          outputKey = category + '--' + key.replace(/_v[0-9]$/g, '') + '--' + country + variation
          outputKey = outputKey.replace(/_v[0-9]$/g, '')

          globalObject[outputKey] = currentSign
        }
      }
      fs.writeFile('build/string-maps/' + country + '-map.json', JSON.stringify(globalObject), function (err) {
        if (err) throw err
      })
    }
  }
})
