var express    = require('express'); 
var bodyParser = require('body-parser'); 
var app        = express();
var config     = require('../config'); 
var vkApi      = require('./lib/vk'); 

app.use(express.static(config.APP.public_dir)); 
app.use(bodyParser.json()); 

app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views'); 

app.get('/', function(req, res){
    res.render('mainpage'); 
}); 

app.get('/vk/:query', function(req,res){
    var query = req.params.query.match(/id\d+$|\d+$|\w+$/ig);  
    if( ! query ){
        return res.status(400).json({
            error: 'invalid query'
        }); 
    }
    
    vkApi
        .parseQuery(query[0])
        .then(function(query){
            return query.type == 'alias'
                   ? vkApi.findUser(query.value)
                   : query.value; 
        })
        .then(function(userId){
            return vkApi.getUserFriends(userId); 
        })
        .then(function(data){
            var response = data.response || {}; 
            var items    = response.items || []; 
            
            res.json(items); 
        })
        .catch(function(err){
        
            res.status(500).json({
                error: err.message
            }); 
        
        }); 
    
}); 

module.exports = app; 