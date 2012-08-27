var fs = require('fs');

// Note these should all be minified
exports.serializeFunction = function(instanceConfiguration) 
{
    // This is the create new blip
    return function(data) 
    {
        if (!data) { console.log('no data'); return; }
    
        if (!data.currentAction) { data.currentAction = 0; }
        
        if (data.currentAction<3) 
        {
            return prepareApplication(data);
        }
        else if (data.currentAction<5)
        {
            return processData(data);
        }
        else if (data.currentAction<6)
        {
            return reportData(data);
        }

        // Do nothing
        data.done = 1;
        return data;
    }
}

exports.initialData = function() {
    return { 
        start: 2000000,
        end: 3000000 
    };
}

function doesFileExist(start, end)
{
    var path = start + '_' + end + '.p';
    var found = false;
   
    try
    { 
        theStats = fs.statSync(path);
        console.log('path: ' + path + ' stats:\r\n' + theStats);
    }
    catch (e)
    {
    }
    return (found);
}

exports.nextData = function(data)
{
    var theData = {};
    
    var blockSearching = true;
    
    while (blockSearching)
    {
        theData.start = data.end + 1;
        theData.end = theData.start + ( data.end - data.start );
        
        blockSearching = doesFileExist(theData.start, theData.end);
        
        // Replace this clause with an actual ending
        if (theData.end>50000000)
        {
            return { 'status': 'success' };
        }
    }
    
    return theData;
}
