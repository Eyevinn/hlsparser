var express = require('express');
var router = express.Router();
var m3u8 = require('m3u8');
var request = require('request');
var shortid = require('shortid')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { bitrates_list: [] });
});
router.post('/', function(req, res) {
  var parser = m3u8.createStream();
  request.get(req.body.hlsfile).pipe(parser);
  var l = [];

  parser.on('item', function(item) {
    console.log(item);
    var uri;
    if(item.properties.uri) {
      uri = item.properties.uri;
    }
    if (item.attributes.attributes.uri) {
      uri = item.attributes.attributes.uri;
    }
    var b = new Buffer(uri);

    var o = { 'filename': uri,
              'bitrate': item.attributes.attributes.bandwidth,
              'uri_b64': b.toString('base64'),
              'convlink': 'http://labs.eyevinn.se/conv.php?source=' + b.toString('base64') + '&name=' + shortid.generate() + '&type=mp4' };
    l.push(o);    
  });

  parser.on('m3u', function(item) {
    res.render('index', { bitrates_list: l });
  });

});
router.post('/convert', function(req, res) {
  console.log(req.body);
  res.render('convert', {} );
});


module.exports = router;
