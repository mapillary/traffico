fs = require('fs');

const europeJson = JSON.parse(fs.readFileSync('build/json/europe.json', 'utf8'));
const usJson = JSON.parse(fs.readFileSync('build/json/us.json', 'utf8'));

var transformations = JSON.parse(fs.readFileSync('build/transformations.json', 'utf8'));


// Loop through sign elements and convert them to stringified html nodes
function stringifySigns(signBatch) {
  stringifiedSigns = {};

  for (sign in signBatch) {
    var newSign = {};

    var currentSign = signBatch[sign]
    var category    = currentSign.category;
    var elements    = currentSign.elements;
    var elString    = '<span class="t">';

    for (el in elements) {
      var e = elements[el];
      var transform = ''
      if (typeof e.transform === 'undefined') {
        transform = '';
      } else {
        transform = e.transform;
        transform = interpolateTransformations(transform);
        transform = vendorPrefixTransformations(transform);
      }

      var html = '<i class="t t-'+ e.type + ' t-c-'+ e.color + '" style="' + transform + '"></i>';
      elString += (html);
    }

    elString += '</span>';

    var s = {}
    stringifiedSigns[sign] = elString;
  }

  return stringifiedSigns;
}

function vendorPrefixTransformations(str) {
  var outputString = '';
  var prefixes = ['-ms-transform', '-webkit-transform', 'transform'];

  for (var p = 0, len = prefixes.length; p < len; p++) {
    outputString += prefixes[p] + ': ' + str + ';'
  }

  return outputString;
}

function cleanUpStrings(str, find, replacement) {
  var re = new RegExp(find, 'g');
  var newStr = str.replace(re, replacement);

  return newStr;
}

function interpolateTransformations(str) {
  s = str;

  for (prop in transformations) {
    var find = '{' + prop + '}';
    var re = new RegExp(find, 'g');

    s = s.replace(re, transformations[prop]);
  }

  return s;
}

// Mapillary specific patching

function patchNamesEu(obj) {
  obj['information_disable_persons']                 =  obj['information_disabled_parking']
  obj['prohibitory_no_trucks']                       =  obj['prohibitory_trucks']
  obj['prohibitory_no_motorcycles']                  =  obj['prohibitory_motorcycles']
  obj['prohibitory_no_motor_vehicles']               =  obj['prohibitory_motor_vehicles']
  obj['danger_animals']                              =  obj['danger_wild_animals']
  obj['danger_priority_next_intersection']           =  obj['priority_next_intersection_right']
  obj['danger_road_works']                           =  obj['danger_construction']
  obj['mandatory_go_left_or_straight']               =  obj['mandatory_turn_left_or_straight']
  obj['mandatory_go_right_or_straight']              =  obj['mandatory_turn_right_or_straight']
  obj['mandatory_pedestrian_cycle_dual_track']       =  obj['mandatory_bicycle_pedestrian_dual_track']
  obj['other_give_way']                              =  obj['priority_give_way']
  obj['other_priority_road']                         =  obj['priority_priority_road']
  obj['prohibitory_no_pedestiran_or_cycles']         =  obj['prohibitory_pedestrians_and_bicycles']
  obj['prohibitory_no_vehicle_with_dangerous_goods'] =  obj['prohibitory_vehicles_with_dangerous_goods']
  obj['prohibitory_noturn_left']                     =  obj['prohibitory_no_turn_left']
  obj['prohibitory_noturn_right']                    =  obj['prohibitory_no_turn_right']
  obj['prohibitory_on_overtaking']                   =  obj['prohibitory_overtaking']
  obj['prohibitory_on_overtaking_trucks']            =  obj['prohibitory_overtaking_trucks']
  return obj;
}

// Mapillary specific patching

function patchNamesUs(obj) {
  obj['school_school_obsolete']        = obj['school_obsolete']
  obj['warning_Y_roads']               = obj['warning_y_roads']
  obj['warning_added_lanes']           = obj['warning_added_lane']
  obj['warning_curve_reverse_left']    = obj['warning_turn_reverse_left']
  obj['warning_curve_reverse_right']   = obj['warning_turn_reverse_right']
  obj['warning_double_reverse_curve']  = obj['warning_double_2_reverse_curve']
  obj['warning_turn_curve_left']       = obj['warning_turn_left_curve']
  obj['warning_turn_curve_right']      = obj['warning_turn_right_curve']
  obj['warning_turn_curve_with_speed'] = obj['warning_turn_right_curve_speed']
  obj['warning_loop_pretzel']          = obj['warning_pretzel_loop']
  obj['warning_winding_road']          = obj['warning_winding_road_left']
  return obj;
}


// Parse transformations

var transformations = JSON.parse(interpolateTransformations(JSON.stringify(transformations)));


// UE SIGNS

var euSigns = interpolateTransformations(
  JSON.stringify(
    patchNamesEu(
      stringifySigns(europeJson))));

var euFileName = 'europe-html-strings.json';

fs.writeFile('build/json/' + euFileName, euSigns, function (err) {
  if (err) throw err;
  console.log(euFileName, 'saved');
});


// US SIGNS

var usSigns = interpolateTransformations(
  JSON.stringify(
    patchNamesUs(
      stringifySigns(usJson))));

var usFileName = 'us-html-strings.json';

fs.writeFile('build/json/' + usFileName, usSigns, function (err) {
  if (err) throw err;
  console.log(usFileName, 'saved');
});
