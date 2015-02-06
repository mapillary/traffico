var fs = require('fs');

var builtFiles = fs.readdir('./build/', function (err, files) {

	var output = '<!DOCTYPE html><meta charset=utf8><link rel=stylesheet href="stylesheets/traffico.css"><style>*{font-family:Helvetica,​Arial,​sans-serif}.t {font-size:50px}.t i:first-child{text-shadow:0 0 3px rgba(0,0,0,.3);transition:1s ease text-shadow}div:hover .t i:first-child{text-shadow:none}div {height:55px;float:left;min-width:300px;border:1px solid #eee;margin:0 -1px -1px 0;padding:.5em}.label{padding:.5em}h2 {clear:both;padding-top:2em}</style><title>traffico sign overview</title>';

	for (var f in files) {
		if (files[f].indexOf('.json', files[f].length - 5) !== -1) {
			console.log("Added signs from "+files[f])+" to overview.";
			var fileContent = fs.readFileSync('build/'+files[f], 'utf8');
			output += '<h2>Signs from '+files[f]+'</h2>';
			var data = JSON.parse(fileContent);
			for (var key in data) {
				var currentSign = '';
				var typeOfVariableContent = null;
				var varValues = {content:[20, 30, 35, 50, 70, 75, 90, 100, 120], height:['2m', '3.5m', '10ft'], width:['2m', '3.5m', '10ft']};

				output += '<div>';

				currentSign += '<span class="t">';
				for (var i in data[key]['elements']) {
					if (typeof varValues[data[key]['elements'][i]['type']] != 'undefined') {
						if (data[key]['elements'][i]['type'] == 'width' || data[key]['elements'][i]['type'] == 'height') {
							currentSign += '<i class="t-'+data[key]['elements'][i]['type']+' t-c-'+data[key]['elements'][i]['value']+'"></i>';
						}
						currentSign += '<i class="t-content{{{length}}} t-c-'+data[key]['elements'][i]['value']+'">{{{variable}}}</i>';
						typeOfVariableContent = data[key]['elements'][i]['type'];
					} else {
						currentSign += '<i class="t-' + data[key]['elements'][i]['type'] + ' t-c-' + data[key]['elements'][i]['value'] + '"></i>';
					}
				}
				currentSign += '</span>';

				if (typeOfVariableContent) {
					for (var i in varValues[typeOfVariableContent]) {
						var value = varValues[typeOfVariableContent][i]+"";
						var length = value.length;
						output += currentSign.replace(/\{\{\{variable\}\}\}/, value).replace(/\{\{\{length\}\}\}/, length == 2 ? '' : '-'+length);
					}
				} else {
					output += currentSign;
				}
				output += '<span class="label">'+data[key]['name']+'</span></div>';
			}
		}
	}

	fs.writeFile('build/signs.html', output, function(err) {
		if (err) throw err;
		console.log("Successfully wrote signs to signs.html.");
	});

});
