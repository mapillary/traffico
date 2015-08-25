var fs = require('fs');

/** Config */
const JSON_DIR = './build/signs/';
const VAR_VALUES = {
    speed_value: [10, 20, 25, 30, 35, 50, 60, 70, 75, 80, 90, 100, 110, 120, 130],
    us_speed_value: [10, 25, 30, 35, 45, 50, 55, 60, 65, 70, 75, 80, 85],
    speed_zone_value: [20,30,40],
    height_value: ['2m ', '3.5m', '10ft'],
    incline_value: ['10%','12%'],
    width_value: ['2m ', '3.5m', '10ft'],
    weight_value: ['3.5t', '10t']
};
const TRANSFORMATIONS = JSON.parse(fs.readFileSync('build/transformations.json', 'utf8'));
/* Config END */

var builtFiles = fs.readdir(JSON_DIR, function(err, files) {
    // Iterate over all *.json files in JSON_DIR
    for (var f in files) {
        if (files[f].indexOf('.json', files[f].length - 5) !== -1) {
            var output = '{';
            var fileContent = fs.readFileSync(JSON_DIR + files[f], 'utf8');
            var data = JSON.parse(fileContent);
            var firstSign = true;

            for (var key in data) {
                var elements = data[key]['elements'];
                //console.log(data.elements);
                var currentSign = '<span class="t">';
                for (var i in elements) {
                    var content = '';

                    // If the sign can have variable content…
                    if (typeof VAR_VALUES[elements[i]['type']] != 'undefined') {
                        // …add the placeholders "{{{length}}}" and "{{{variable}}}", which will be replaced later
                        content = '{{{variable}}}';
                        typeOfVariableContent = elements[i]['type'];
                        elements[i]['type'] = 'content{{{length}}}';
                    } else if (typeof elements[i]['content'] != 'undefined') {
                        content = elements[i]['content'];
                    }
                    // Insert named transformations
                    var transformRegex = /\{[a-z0-9_]+\}/i;
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
                        elements[i]['transform'] = ' style="-webkit-transform:'+elements[i]['transform']+';-moz-transform:'+elements[i]['transform']+';transform:'+elements[i]['transform']+'"';
                    } else {
                        elements[i]['transform'] = '';
                    }
                    // add the sign element itself
                    currentSign += '<i class="t-' + elements[i]['type'] + ' t-c-' + elements[i]['color'] + '"'+elements[i]['transform']+'>'+content+'</i>';
                }

                currentSign += '</span>'
                if (!firstSign) {
                    firstSign = false;
                    output += ","
                }
                firstSign = false;
                output += "\"" + key + "\":" + "\"" + currentSign.replace(/"/g, "\\\"") + "\"" ;
            }
            output += "}"
            console.log(output);

            fs.writeFile("./build/json/map/" + files[f], output, function(err) {
                if (err) throw err;
            });


            //fs.writeFile(OUTPUT_FILES[i]['path'], OUTPUT_FILES[i]['prefix'] + output + OUTPUT_FILES[i]['suffix'], function(err) {
            //    if (err) throw err;
            //});
        }
    }
});
