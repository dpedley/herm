var app = require('http').createServer(handler);
var url = require('url');
var central = require('./endpoints');
var fs = require('fs');

app.listen(8614);

//function sendFile(req, res, 

function handler (req, res) 
{ 
    var reqData = [];
    req.on('data', function(chunk){ reqData.push(chunk); });
    req.on('end', function()
    {
       var parsedUrl = url.parse(req.url);
       
//       console.log(parsedUrl);
       if (parsedUrl.path=='/') 
       { 
           res.writeHead(200);
           
           central.init(function(initString) 
           {
                res.end(initString);
           });
       } else {            
            var cmdArgs = parsedUrl.path.substring(1).split('/');
            if (cmdArgs[0]=='pu') 
            {
                central.pu(req, res, parsedUrl, reqData.join(''));
            } 
            else if (cmdArgs[0]=='i') 
            {
                console.log('===include===');
                fs.readFile('application/include/'+cmdArgs[1] + '.js', function (err, data) 
                {
                    if (err) throw err;
                    res.end(data);
                });
                
           } 
           else if (cmdArgs[0]=='h') 
           {
                console.log('===herm===');
                fs.readFile('network/'+cmdArgs[1] + '.js', function (err, data) 
                {
                    if (err) throw err;
                    res.end(data);
                });
           }
        }
    });
}
