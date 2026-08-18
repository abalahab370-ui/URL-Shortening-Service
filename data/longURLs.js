const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;

const longURLs = new Schema ({
    url: {
      type: String,
      required: [true, 'Original URL is required'],
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true, // Speeds up search queries when looking up /shorten/:shortCode
      trim: true,
    },
    accessCount: {
      type: Number,
      default: 0,
      min: 0,
    }
} ,
  {
    timestamps: true, // Automatically creates and manages `createdAt` and `updatedAt`
  } 
)

module.exports = mongoose.model ( 'URLs' , longURLs ) ;