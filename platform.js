var application = require('./application');
var HERM = require('./machine/herm');

var blip = {
    autorun: { 
        header: '(function() {',
        footer: '})();', 
    },
    norun: { 
        header: '',
        footer: '' 
    },
};

exports.newBlip = function() 
{
    return blip.autorun.header + HERM.machine(application) + blip.autorun.footer;
};

exports.cleanBlip = function(blip) 
{
    return exports.newBlip();
};

exports.nextData = function(data)
{
    return 
}

exports.nextBlip = function(data)
{
    var nextObj = application.nextData(data);
    console.log('next Blip:' + nextObj);
    return HERM.machineData(application, nextObj);
}
