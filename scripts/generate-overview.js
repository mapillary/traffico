var fs = require('fs');

/** Config */
const JSON_DIR = './build/json/';
const VAR_VALUES = {
  speed_value: [10, 20, 25, 30, 35, 50, 70, 75, 90, 100, 110, 120, 130],
  height_value: ['2m ', '3.5m', '10ft'],
  width_value: ['2m ', '3.5m', '10ft'],
  weight_value: ['3.5t', '10t']
};
const OUTPUT_FILES = [{
  path: 'build/sign-overview.html',
  prefix: '<!DOCTYPE html>' +
    '<meta charset=utf8>' +
    '<link rel=stylesheet href="stylesheets/traffico.css?'+Date.now()+'">' +
    '<link rel=stylesheet href="stylesheets/examples.css?'+Date.now()+'">' +
    '<style>' +
    '*{font-family:Helvetica,​Arial,​sans-serif}' +
    'body{margin:0;padding:0 0 2em}' +
    'h3{margin:0;padding:0 1em}' +
    '</style>' +
    '<title>traffico sign overview</title><div class=examples>',
  suffix: '</div>'
}, {
  path: 'build/gh-pages/examples.html',
  prefix: '---\n' +
    'layout: default\n' +
    'title: Traffico - Examples\n' +
    '---\n' +
    '<div class="examples-container l-box">' +
    '<div class="pure-u-1">' +
    '<h1>Examples</h1><p>Traffico comes with the following set of pre-built signs that is fully customizable and extendable:</p>' +
    '</div>' +
    '<div class="pure-u-1 examples">',
  suffix: '</div></div>\n'
}];
const TRANSFORMATIONS = JSON.parse(fs.readFileSync('build/transformations.json', 'utf8'));
/** Config END */

var builtFiles = fs.readdir(JSON_DIR, function(err, files) {

  var output = '';

  // Iterate over all *.json files in JSON_DIR
  for (var f in files) {
    if (files[f].indexOf('.json', files[f].length - 5) !== -1) {
      output += '<h2>' +
        (files[f].length == 7 ?
          files[f].charAt(0).toUpperCase()+files[f].charAt(1).toUpperCase() :
          files[f].charAt(0).toUpperCase() + files[f].slice(1)
        ).substring(0, files[f].length - 5) +
        '</h2>';
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
          var content = '';
          // If the sign can have variable content…
          if (typeof VAR_VALUES[elements[i]['type']] != 'undefined') {
            // …add the placeholders "{{{length}}}" and "{{{variable}}}", which will be replaced later
            content = '{{{variable}}}';
            typeOfVariableContent = elements[i]['type'];
            elements[i]['type'] = 'content{{{length}}}';
          }
          // Insert named transformations
          var transformRegex = /\{[a-z_]+\}/i;
          var match;
          while((match = transformRegex.exec(elements[i]['transform'])) != null) {
            match[0] = match[0].substr(1,match[0].length-2);
            if (typeof TRANSFORMATIONS[match[0]] != 'undefined') {
              elements[i]['transform'] = elements[i]['transform'].replace('{'+match[0]+'}', TRANSFORMATIONS[match[0]]);
            }
          }
          // Prepare transformations
          if (typeof elements[i]['transform']!='undefined') {
            elements[i]['transform'] = elements[i]['transform'].replace('"', '&quot;').replace(';', '');
            elements[i]['transform'] = 'style="-webkit-transform:'+elements[i]['transform']+';-moz-transform:'+elements[i]['transform']+';transform:'+elements[i]['transform']+'"';
          }
          // add the sign element itself
          currentSign += '<i class="t-' + elements[i]['type'] + ' t-c-' + elements[i]['value'] + '"'+elements[i]['transform']+'>'+content+'</i>';
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
      console.log("Gathered "+numSigns+" signs from " + files[f]) + " for overview.";
    }
  }

  for (i in OUTPUT_FILES) {
    // Write the complete HTML-file
    console.log('Writing signs to '+OUTPUT_FILES[i]['path']+'…');
    fs.writeFile(OUTPUT_FILES[i]['path'], OUTPUT_FILES[i]['prefix'] + output + OUTPUT_FILES[i]['suffix'], function(err) {
      if (err) throw err;
    });
  }
});
