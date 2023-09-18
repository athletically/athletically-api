const responseLib = require('../libs/responseLib');
const appConfig = require('../../config/appConfig');
let check = require('../libs/checkLib');


let rateLimiter =   (secondsWindow=60,allowedHits=5) => {
    try{ 
        return async (req,res,next) => {
            let client = require('../../www/db/db').redis_client;
            //await client.connect();
            let counter_id = req.user.user_id;
            let requests = await client.incr(counter_id);
            let ttl;
            if(requests == 1){
                await client.expire(counter_id,secondsWindow);
                ttl = secondsWindow;
            }else{
                ttl = await client.ttl(counter_id);
            }
            //await client.disconnect();
            if(requests>allowedHits){
                let apiResponse = responseLib.generate(true,`Too many Requests..Try after cool-down`, {callsInAMinute:requests,ttl:ttl});
                res.status(429).send(apiResponse)
            }else{
                next()
            }
        }
    }catch(err){
        let apiResponse = responseLib.generate(true,`${err.message}`, null);
        res.status(500);
        res.send(apiResponse)
    }
}

let rateLimiterByIP =   (secondsWindow=60,allowedHits=5) => {
    try{ 
        return async (req,res,next) => {
            let client = require('../../www/db/db').redis_client;
            //await client.connect();
            let counter_id = req.connection.remoteAddress + '://' + req.connection.remotePort;
            let requests = await client.incr(counter_id);
            let ttl;
            if(requests == 1){
                await client.expire(counter_id,secondsWindow);
                ttl = secondsWindow;
            }else{
                ttl = await client.ttl(counter_id);
            }
            //await client.disconnect();
            if(requests>allowedHits){
                let apiResponse = responseLib.generate(true,`Too many Requests..Try after cool-down`, {callsInAMinute:requests,ttl:ttl});
                res.status(429).send(apiResponse)
            }else{
                next()
            }
        }
    }catch(err){
        let apiResponse = responseLib.generate(true,`${err.message}`, null);
        res.status(500);
        res.send(apiResponse)
    }
}


module.exports = {
    rateLimiter:rateLimiter,
    rateLimiterByIP:rateLimiterByIP
}