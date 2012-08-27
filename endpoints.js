var platform = require('./platform');
var fs = require('fs');

var headerTemplate = '';

exports.init = function(completion) 
{
    if (headerTemplate == '')
    {
        fs.readFile('application/include/headerTemplate.js', function (err, data) 
        {
            if (err) throw err;
            headerTemplate = data;
            completion(data);
        });
    }
    else
    {
        completion(headerTemplate);
    }
};

exports.pu = function(req, res, parsedUrl, bodyData) 
{
    if (req.method=='GET') 
    {
        res.writeHead(200);
        
        if (bodyData.length>0) 
        {
            res.end(platform.cleanBlip(bodyData));        
        }
        else 
        {
            res.end(platform.newBlip());        
        }
    }
    else if (req.method=='POST')
    {
        console.log('POST ' + bodyData.length);
        var bodyObj = JSON.parse(bodyData);
        console.log('POST parsesd');
        
        res.writeHead(200);
        if (bodyObj && bodyObj.start)
        {
            fs.writeFile(bodyObj.start + '_' + bodyObj.end + '.p', bodyData, function (err) {
                if (err) throw err;
                console.log('It\'s saved!');
            });
            
            res.end(platform.nextBlip(bodyObj));
        }
        else
        {
            console.log('else done');
            res.end(JSON.stringify({status:'success'}));
        }
    }
};