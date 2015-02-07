var fs = require('fs');

/** Config */
const JSON_DIR = './build/json/';
const VAR_VALUES = {
  content: [10, 20, 25, 30, 35, 50, 70, 75, 90, 100, 110, 120, 130],
  height: ['2m', '3.5m', '10ft'],
  width: ['2m', '3.5m', '10ft'],
  weight: ['3.5t', '10t']
};
const OUTPUT_FILES = [{
  path: 'build/signs.html',
  prefix: '<!DOCTYPE html>' +
    '<meta charset=utf8>' +
    '<link rel=stylesheet href="stylesheets/traffico.css?'+Date.now()+'">' +
    '<style>' +
    '*{font-family:Helvetica,​Arial,​sans-serif}' +
    'body{margin:0;padding:0 0 2em}' +
    '.t {font-size:50px}' +
    '.t i:first-child{text-shadow:0 0 3px rgba(0,0,0,.3);transition:1s ease text-shadow}' +
    '.signContainer:hover .t i:first-child{text-shadow:none}' +
    '.signContainer {display:inline-block;padding:.5em .75em 1em}' +
    '.categoryContainer {padding:0 10px}' +
    '.label{position:absolute;display:none}' +
    '.signContainer:hover .label{display:block}' +
    'h2,h3 {clear:both;padding:10px;margin:0}' +
    'h2 {padding-top:2em;border-bottom:2px solid #ccc}' +
    '</style>' +
    '<title>traffico sign overview</title>',
  suffix: ''
}, {
  path: 'build/gh-pages/example.html',
  prefix: '---\n' +
    'layout: default\n' +
    'title: Traffico - Examples\n' +
    '---\n' +
    '<div class="examples-container l-box">' +
    '<div class="pure-u-1">' +
    '<h1>Examples</h1>' +
    '</div>' +
    '<div class="pure-u-1 examples">',
  suffix: '</div></div>'
}];
/** Config END */

var builtFiles = fs.readdir(JSON_DIR, function(err, files) {

  var output = '';

  // Iterate over all *.json files in JSON_DIR
  for (var f in files) {
    if (files[f].indexOf('.json', files[f].length - 5) !== -1) {
      output += '<h2>Signs from ' + files[f] + '</h2>';
      var fileContent = fs.readFileSync(JSON_DIR + files[f], 'utf8');

      // This variable is an associative array with the category-name as key. The value for each key is an array of signContainer-<div>s (as string) for this category.
      var signCategories = {};

      var data = JSON.parse(fileContent);
      // Iterate over the individual signs in the json-file
      for (var key in data) {
        // This variable will contain one single sign
        var currentSign = '<span class="t">';
        // This variable will contain a <div> with one sign (or multiple signs for variable-content-signs) in it
        var currentSignContainer = '<div class="signContainer">';
        // This variable will be set to the type of the variable sign content (for possible values see the keys of VAR_VALUES) or null if the sign is not variable
        var typeOfVariableContent = null;
        // Shortcut for the array of sign elements
        var elements = data[key]['elements'];

        // Iterate over the elements of the current sign
        for (var i in elements) {
          // If the sign can have variable content…
          if (typeof VAR_VALUES[elements[i]['type']] != 'undefined') {
            // …add the placeholders "{{{length}}}" and "{{{variable}}}", which will be replaced later
            if (elements[i]['type'] == 'width' || elements[i]['type'] == 'height') {
              currentSign += '<i class="t-' + elements[i]['type'] + ' t-c-' + elements[i]['value'] + '"></i>';
            }
            currentSign += '<i class="t-content{{{length}}} t-c-' + elements[i]['value'] + '">{{{variable}}}</i>';
            typeOfVariableContent = elements[i]['type'];
          } else {
            // … else simply add the plain sign element
            currentSign += '<i class="t-' + elements[i]['type'] + ' t-c-' + elements[i]['value'] + '"></i>';
          }
        }
        currentSign += '</span>';

        // If sign has variable content…
        if (typeOfVariableContent) {
          // … iterate over the possible values and replace the placeholders
          for (var i in VAR_VALUES[typeOfVariableContent]) {
            var value = VAR_VALUES[typeOfVariableContent][i] + "";
            var length = value.length;
            currentSignContainer += currentSign.replace(/\{\{\{variable\}\}\}/, value).replace(/\{\{\{length\}\}\}/, length == 2 ? '' : '-' + length);
          }
        } else {
          currentSignContainer += currentSign;
        }
        currentSignContainer += '<span class="label">' + data[key]['name'] + '</span></div>';

        // Set category to "undefined" if it is not set in the json-file
        if (typeof data[key]['category'] == 'undefined') {
          data[key]['category'] = 'undefined';
        }
        // Initialize category-array if category was empty until now
        if (typeof signCategories[data[key]['category']] == 'undefined') {
          signCategories[data[key]['category']] = [];
        }
        // Insert sign-container into correct category
        signCategories[data[key]['category']][signCategories[data[key]['category']].length] = currentSignContainer;
      }
      var numSigns = 0;
      // Output all the sign categories one after another
      for (var category in signCategories) {
        output += '<h3>' + category + '</h3><div class="categoryContainer">' + signCategories[category].join('') + '</div>';
        numSigns += signCategories[category].length;
      }
      console.log("Added "+numSigns+" signs from " + files[f]) + " to overview.";
    }
  }

  for (i in OUTPUT_FILES) {
    // Write the complete HTML-file
    fs.writeFile(OUTPUT_FILES[i]['path'], OUTPUT_FILES[i]['prefix'] + output + OUTPUT_FILES[i]['suffix'], function(err) {
      if (err) throw err;
    });
    console.log('Successfully wrote signs to '+OUTPUT_FILES[i]['path']);
  }
});
