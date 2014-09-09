var express = require('express');
var router = express.Router();

/*
 * GET newuser.
 */
router.get('/newuser/:email/#/:code', function(req, res) {
	var db = req.db;
	
	db.collection('users').find({'email' : req.params.email}).toArray(function(err, items) {
		
		$.each(items, function() {
			
			// If code sent matches code stored, then mark user as verified
			if (this.code === req.params.code) {
				
				db.collection('users').update({ email : req.params.email }, { $set : { verif : 'Y' } }, 
					function(err, result) {
						
						if (err === null) {
							
						}
				});
			}
		});
	});
});

module.exports = router;