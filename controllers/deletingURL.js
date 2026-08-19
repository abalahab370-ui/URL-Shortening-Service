const client = require('../data/rdConnection');
const url = require('../data/longURLs');

const deleteURL = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // 1. Delete from MongoDB (returns deleted document or null)
    const dbResult = await url.findOneAndDelete({ shortCode }).exec();

    if (!dbResult) {
      return res.status(404).json({ error: 'There is no URL related to this ShortCode' });
    }

    // 2. Delete key from Redis RAM
    await client.del(`url:${shortCode}`);

    // 3. Send 204 No Content response expected by the frontend
    return res.status(204).send();

  } catch (err) {
    console.error(`Sir We have a problem in DeleteURL: ${err}`);
    return res.status(500).json({ error: 'Server error during URL deletion' });
  }
};

module.exports = deleteURL;