var Datastore = require('nedb');
var config    = require('../../config').DB; 
var file      = [config.dir, config.file].join('/'); 

var db = new Datastore({ filename: file, autoload: true });

module.exports = db; 