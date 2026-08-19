const client = require('../data/rdConnection');
const url = require('../data/longURLs');

const updatingURL = async (req, res) => {
  try {
    const { shortCode } = req.params; // Fixed casing
    const newURL = req.body.url;

    // 1. Input Validation
    if (!newURL) {
      return res.status(400).json({ error: 'New URL is required' });
    }

    // 2. Update MongoDB (Source of Truth)
    const dbResult = await url.findOneAndUpdate(
      { shortCode },
      { url: newURL },
      { new: true } // Returns the updated document
    ).exec();

    if (!dbResult) {
      return res.status(404).json({ error: 'There is no URL related to this ShortCode' });
    }

    // 3. Update Redis (Updates ONLY the 'url' field in the Hash without resetting accessCount)
    await client.hSet(`url:${shortCode}`, 'url', newURL);

    // 4. Return Updated Object to Frontend
    return res.status(200).json({
      shortCode,
      url: dbResult.url,
      accessCount: dbResult.accessCount
    });

  } catch (err) {
    console.error(`Sir We have a problem in UpdatingURL : ${err}`);
    return res.status(500).json({ error: 'Server error during URL update' });
  }
};

module.exports = updatingURL;