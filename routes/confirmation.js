var express = require('express');
var router = express.Router();

/*
 * GET newuser.
 */
router.get('/newuser/:email/x/:code', function(req, res) {
	var db = req.db;
	
	db.collection('users').find({'email' : req.params.email}).toArray(function(err, items) {
		
		var text = '';
		
		for (var user in items) {
			
			text += user.code;
			
			// If code sent matches code stored, then mark user as verified
			/*if (this.code === req.params.code) {
				
				db.collection('users').update({ email : req.params.email }, { $set : { verif : 'Y' } }, 
					function(err, result) {
						
						if (err === null) {
							
							res.render('conf', { title: 'Quote It!' });
						}
				});
			}*/
		}
		
		res.send(text);
	});
});

module.exports = router;