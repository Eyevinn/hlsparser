var express = require('express');
var router = express.Router();
var m3u8 = require('m3u8');
var request = require('request');

router.get('/', function(req, res) {
   
});

router.post('/parse', function(req, res) {
  uri = req.body.text;
  if(uri) {
    var parser = m3u8.createStream();
    var parse_error;
    request
      .get(uri)
      .on('error', function(err) {
        res.send('Failed to connect to server: ' + err.code);
      })
      .pipe(parser)
      .on('error', function(err) {
        if(!parse_error) {
          parse_error = err;
          res.send("Parser failed with error: " + err);
        }
      });
    var items = [];

    parser.on('item', function(item) {
      // console.log(item);
      var file;
      if(item.properties.uri) {
        file = item.properties.uri;
      }
      if(item.attributes.attributes.uri) {
        file = item.attributes.attributes.uri;
      }
      var o = {
        'uri': file,
        'bandwidth': item.attributes.attributes.bandwidth
      };
      items.push(o);
    });

    parser.on('m3u', function(item) {
      var text = '';
      for(i in items) {
        var o = items[i];
        text = text + o['bandwidth'] + ": " + o['uri'] + '\n';
      }
      res.send(text);
    }); 
  } else {
    // Return bad response error code
  }
});

module.exports = router;
