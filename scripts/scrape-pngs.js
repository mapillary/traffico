var page = require('webpage').create()

page.viewportSize = { width: 1920, height: 1080 }
page.onLoadFinished = function (status) {
  console.log('Status: ' + status)
}

page.open('http://traffico.io/examples.html', function (status) {
  console.log('opened', status)
  var signs = page.evaluate(function () {
    var ret = []
    /* scale the whole body */
    // document.body.style.webkitTransform = "scale(2)";
    // document.body.style.webkitTransformOrigin = "0% 0%";
    for (var i = 0; i < 300; i++) {
      if (document.getElementsByClassName('signContainer')[i] !== undefined) {
        var clip = {}
        clip['clip'] = document.getElementsByClassName('signContainer')[i].getBoundingClientRect()
        clip['name'] = document.getElementsByClassName('signContainer')[i].className.split(' ')[1]
        ret.push(clip)
      }
    }
    return ret
  })
  for (var i = 0; i < signs.length; i++) {
    var sign = signs[i]
    page.clipRect = {
      top: sign.clip.top,
      left: sign.clip.left,
      width: sign.clip.width,
      height: sign.clip.height
    }
    var file = 'build/pngs/' + sign.name + '.png'
    console.log('writing to', file)
    page.render(file, {format: 'png'})
  }
  phantom.exit() // eslint-disable-line
})
