var fs = require('fs');

var machineTemplate;

fs.readFile('machine/hermTemplate.js', 'utf8', function (err, data) 
    {
        if (err) throw err;
        machineTemplate = data;
    });

exports.machineData = function(application, theData) 
{
    var jsonData = JSON.stringify((theData)?theData:application.initialData());    
    return '{ "data": ' + jsonData + '}';
}

exports.machine = function(application, theData) 
{
    var functionString = application.serializeFunction().toString();
    var jsonData = JSON.stringify((theData)?theData:application.initialData());
    var machineString = machineTemplate.replace("HERM:SESSION_DATA", jsonData);
    machineString = machineString.replace("HERM:SESSION_FUNCTION", functionString);

    return machineString;
}