const express = require("express") ;
const router = express.Router() ;
const creatShortURL = require("../controllers/creatingURLs") ;
const redirectingURL = require("../controllers/redirectingControlles") ;
const statsController = require("../controllers/statsController") ;

router.post ( '/' , creatShortURL ) ;

router.get('/:shortCode',redirectingURL );

router.get ( '/:shortCode/stats' , statsController )



module.exports = router ;