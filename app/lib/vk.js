var qs      = require('querystring'); 
var extend  = require('util')._extend; 
var request = require('request'); 
var Promise = require('bluebird'); 
var config  = require('../../config').VK; 

function VK(settings){
    var config = settings || {}; 
    this.config = {
        baseUrl: 'https://api.vk.com/method/', 
        version: config.version || config.v || '5.53'
    };
}; 

VK.prototype.parseQuery = function(str){
    return new Promise(function(resovle, reject){
        var type  = str.match(/^(id)?\d+$/i) 
                    ? 'id'
                    : 'alias'; 
        
        var value = type == 'id'
                    ? str.replace('id', '') 
                    : str; 
        
        resovle({
            type : type,
            value: value
        }); 
        
    }); 
}; 

VK.prototype.findUser = function(str){
    return this._makeRequest('users.get', {user_ids: str})
        .then(function(data){
            var response = data.response || []; 
                
            if( ! response || ! response.length ) 
                throw Error('nothing found'); 
                
            return response[0].id;  
        }); 
    
}; 

VK.prototype.getUserFriends = function(str){
    
    return this._makeRequest('friends.get', {user_id: str})
        .then(function(data){
            if( data.error ){
                throw Error(data.error.error_msg); 
            }
            return data;  
        }); 

    
}; 

VK.prototype._getUrl = function(method, params){
    var version = this.config.version; 
    var query   = extend(params, {
        v: version
    }); 
    var url = [method, qs.stringify(query)].join('?');  
    return [this.config.baseUrl, url].join('');    
}; 

VK.prototype._makeRequest = function(method, params){
    var url = this._getUrl(method, params); 
    var req = {
       method: 'GET', 
       uri: url
    }; 
    
    return new Promise(function(resolve, reject){
        request(req, function(err, response, data){
            if( err ){
                throw err; 
            }
            
            resolve(JSON.parse(data)); 
        }); 
    }); 
}; 

module.exports = new VK({version: config.version });  