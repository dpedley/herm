
function runCycle(data)
{
console.log('wtf');
}

function prepareApplication(data)
{
    switch (data.currentAction)
    {
        // action 0 is init
        // actions 1 - 2 build the primes from 1 to 1,000,000
        // these are used to sieve the rest of the requests.
        
        case 0:
        {
            data.primeStart = new Date().getTime();
            console.log('Initial timestamp: ' + data.primeStart);
            
            if (!data.primes)
            {
                data.primes = [ ];

                if (!data.seive)
                {
                    data.sieve = [ ];
                    for (i=0; i<=1000000; i++)
                    {
                        data.sieve.push((i<2)?0:1);
                    }
                }
                
                data.currentAction = 1;
            }
            else
            {
                // The primes are already made, jump to step 3
                data.currentAction = 3;
            }
        }
        break;
        case 1:
        {
            if (!data.checkIndex) { data.checkIndex = 0; }
            
            for (maxStep=data.checkIndex; 
                    ((data.checkIndex-maxStep)<100000) && (data.checkIndex<=1000000); 
                        data.checkIndex++)
            {
                if (data.sieve[data.checkIndex])
                {
                    // it's a prime, so mark off the products within the sieve
                    for (j=data.checkIndex*2; j<=1000000; j+=data.checkIndex)
                    {
                        data.sieve[j]=0;
                    }
                }
            }
            
            if (data.checkIndex>=1000000)
            {
                delete data['checkIndex'];
                data.currentAction = 2; // we found them all, now move on
            }
        }
        break;
        case 2:
        {
            for (i=0; i<=1000000; i++)
            {
                if (data.sieve[i]==1)
                {
                    data.primes.push(i);
                }
            }
            
            delete data['sieve'];
            data.currentAction = 3;
        }
        break;
        default:
        break;
    }

    // ************ RETURN POINT ********************
    return data;
}

function processData(data)
{
    switch (data.currentAction)
    {
        case 3:
        {
            if (!data.goal)
            {
                data.goal = [];
                var startGoal = new Date().getTime();
                console.log('making candidates block...' + startGoal);
            }
            
            if (!data.candidates)
            {
                data.candidates = [];
                
                for (i=data.start; i<=data.end; i++)
                {
                    data.candidates.push(1);
                }
            }
            
            if (!data.primeIndex) { data.primeIndex = 0; }
            
            for (maxStep=data.primeIndex; 
                    ((data.primeIndex-maxStep)<10000) && (data.primeIndex<data.primes.length); 
                        data.primeIndex++)
            {
                var p = data.primes[data.primeIndex];
                var base = p * (Math.floor(data.start/p));

                for (j=(base+p); j<=data.end; j+=p)
                {
                    data.candidates[(j - data.start)]=0;
                }
            }
            
            if (data.primeIndex>=data.primes.length)
            {
                delete data['primeIndex'];
                data.currentAction = 4; // we sieved all the primes
            }

        }
        break;
        case 4:
        {
            for (n=0; n<data.candidates.length; n++)
            {
                if (data.candidates[n]==1)
                {
                    data.goal.push(n + data.start);
                }
            }

            delete data['candidates'];
            console.log('completed sieve...' + new Date());

            console.log('goal count: ' + data.goal.length);
            data.currentAction = 5;
        }
        break;
        default:
        break;
    }
    
    return data;
}

function reportData(data)
{
    setTimeout(function() {
        data.primeEnd = new Date().getTime();
        console.log('Elapsed time: ' + (data.primeEnd - data.primeStart) + '(ms)');
        console.log('Sending result to server');
        
        var postBody = { goal: data.goal, start: data.start, end: data.end, runtime: (data.primeEnd - data.primeStart) };
        
        $.post('/pu', JSON.stringify(postBody), function(postResponseBody){
            console.log('we got a response: ' + postResponseBody);
            try
            {
                var nextSession = JSON.parse(postResponseBody);
                if (nextSession.status && nextSession.status=='success')
                {
                    console.log('mission complete');
                }
                else
                {
                    herm.initializeSession(nextSession);
                    herm.runSession(10);    
                }
            }
            catch (e)
            {
                console.log('pu error: ' + e);
            }
        });
    }, 5000);
    data.currentAction = 6;
    return data;
}

