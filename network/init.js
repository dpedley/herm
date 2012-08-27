var herm = (herm)?herm:{};

herm.initializeSession = function(hermSession) 
{
    var removeOnInit = [ 'done', 'currentAction', 'goal' ]; // Maybe move these to a config

    if (!herm.data)
    {
        herm.data = hermSession.data;
    }
    else
    {
        for (name in hermSession.data)
        {
            herm.data[name] = hermSession.data[name];
        }
    }
    
    for (name in hermSession)
    {
        if (name!='data')
        {
            herm[name] = hermSession[name];
        }
    }
    
    for (i in removeOnInit)
    {
        var key = removeOnInit[i];
        console.log('testing: ' + key);
        if (herm.data[key] != undefined)
        {
            console.log('removing: ' + key);
            delete herm.data[key];
        }
    }
}

herm.runSession = function(theInterval)
{
    console.log('Run ' + herm.data.currentAction + 'Session: ' + herm.data );
    
    herm.id = setInterval(
        function()
        {
        
            if (!herm.running)
            {
                herm.running = 1;
                
                // Run application iteration
                herm.data = herm.blip(herm.data); 
                
                if (herm.data.done) 
                {
                    clearInterval(herm.id);
                    console.log(herm.data);
                }

                delete herm['running'];
            }
        },
    theInterval);
}