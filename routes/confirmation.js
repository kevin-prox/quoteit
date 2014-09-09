var express = require('express');
var router = express.Router();

/*
 * GET newuser.
 */
router.get('/newuser/:email/code/:code', function(req, res) {
	var db = req.db;
	
	db.collection('users').find({'email' : req.params.email}).toArray(function(err, items) {
		
		$.each(items, function() {
			
			// If code sent matches code stored, then mark user as verified
			if (this.code === req.params.code) {
				
				db.collection('users').update({ email : req.params.email }, { verif : "Y" }, 
					function(err, result) {
						
						if (err === null) {
							
							res.render('conf', { title: 'Quote It!' });
						} else {
							
							res.send('HOLA');
						}
				});
			}
		});
	});
});

/*
 * GET newuser.
 */
router.get('/test/:email/code/:code', function(req, res) {
	var db = req.db;
	
	db.collection('users').find({'email' : req.params.email}).toArray(function(err, items) {
		
		res.json(items+req.params.code);
	});
});

module.exports = router;