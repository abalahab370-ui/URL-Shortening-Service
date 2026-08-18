const express = require("express") ;
const router = express.Router() ;
const creatShortURL = require("../controllers/creatingURLs") ;

app.post( '/' , creatShortURL ) ;