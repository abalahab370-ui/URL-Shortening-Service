const client = require('../data/rdConnection') ;
const url = require('../data/longURLs') ;


const redirectingController = async (req , res) => {
  try {
    const { shortCode } = req.params;

    // 1. Check Redis RAM
    const rdResult = await client.hGetAll(`url:${shortCode}`);

    // FIX: Check if object is empty (Node-Redis returns {} on miss)
    if (!rdResult || Object.keys(rdResult).length === 0) {
      
      // 2. Cache Miss: Fallback to MongoDB
      const dbResult = await url.findOne({ shortCode }).exec() ;
      if (!dbResult) {
        return res.status(404).json({ message: 'There is no URL related to this ShortCode' });
      }

      // Increment click count for this access
      dbResult.accessCount += 1;
      await dbResult.save();

      // Populate Redis cache with updated data
      await client.hSet(`url:${shortCode}`, {
        url: dbResult.url,
        accessCount: dbResult.accessCount.toString()
      });

      // FIX: .expire() instead of .expired() (24h TTL)
      await client.expire(`url:${shortCode}`, 86400);

      return res.redirect(301, dbResult.url);
    }

    // 3. Cache Hit: Increment Redis RAM counter instantly
    await client.hIncrBy(`url:${shortCode}`, 'accessCount', 1);

    // Asynchronously sync click count to MongoDB in background
    url.updateOne({ shortCode }, { $inc: { accessCount: 1 } }).exec();

    // Serve redirect directly from RAM
    return res.redirect(301, rdResult.url);

  } catch (err) {
    console.error(`Error redirecting short code: ${err}`);
    return res.status(500).json({ error: 'Server error during redirect' });
  }
} ;

module.exports = redirectingController ;
