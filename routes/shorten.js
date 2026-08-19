const express = require("express") ;
const router = express.Router() ;
const creatShortURL = require("../controllers/creatingURLs") ;
const redirectingURL = require("../controllers/redirectingControlles") ;
const statsController = require("../controllers/statsController") ;
const updatingURL = require("../controllers/updatingURL") ;

router.post ( '/' , creatShortURL ) ;

router.get ('/:shortCode',redirectingURL );

router.put ( '/:shortCode' , updatingURL ) ;

router.delete ( '/:shortCode' , deletingURL ) ;

router.get ( '/:shortCode/stats' , statsController );




module.exports = router ;