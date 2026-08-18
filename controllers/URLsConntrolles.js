const express = require("express") ;
const client = require("../data/rdConnection") ;
const longURLs = require("../data/longURLs") ;
const generateURLs = require("./generatingURLs") ;

const ShortURL = generateURLs() ;

//So What we gonna do here ammmm , well i see that we got to get the req then generating a simple ShortUrl for it  :

const creatShortURL = async (req , res) => {
      try {
            //Well the methode that am gonna use is a bit diffrent this time cuz the redis data can be exprired before the database one so if its not in the redis doesnt means its not in the database and accessing the database directly will crush our server to fast with overload , So we got a find a real smart way to see if this short Url already exist on not without too heavy proccess ! 

            const { url } = req.body;

            let shortCode;
            let newUrlRecord;

            // 1. Attempt DB creation (Retry on duplicate code collision)
            let retries = 3;
            while (retries > 0) {
            try {
                  shortCode = generateShortCode(8);
                  newUrlRecord = await Url.create({ url, shortCode });
                  break; // Creation succeeded, exit retry loop
            } catch (error) {
                  if (error.code === 11000 && retries > 1) {
                  retries--;
                  continue;
                  }
                  // Non-duplicate DB error
                  return res.status(500).json({ error: 'Database transaction failed' });
            }
            }

            // 2. Non-blocking Cache Write
            // If Redis is down, we log the error but STILL return 201 to the user
            try {
            await redis.set(`url:${shortCode}`, url, {'EX': 86400});
            } catch (redisError) {
            console.error('Redis Caching Failed:', redisError.message);
            }

            // 3. Return created resource
            return res.status(201).json(newUrlRecord);


      } catch (err) {
            console.log(`Sir We have an error in creatingShortURL : ${err}`) ;
      }
} ;

module.exports = creatShortURL ;