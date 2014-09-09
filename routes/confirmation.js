var express = require('express');
var router = express.Router();

/*
 * GET newuser.
 */
router.get('/newuser/:email/x/:x', function(req, res) {
	var db = req.db;
	
	db.collection('users').find({'email' : req.params.email}).toArray(function(err, items) {
		
		$.each(items, function() {
			
			// If code sent matches code stored, then mark user as verified
			if (this.code === req.params.x) {
				
				db.collection('users').update({ email : req.params.email }, { verif : "Y" }, 
					function(err, result) {
						
						if (err === null) {
							
							res.render('conf', { title: 'Quote It!' });
						}
				});
			}
		});
	});
});

/*
 * GET newuser.
 */
router.get('/test/:email/x/:x', function(req, res) {
	var db = req.db;
	var test = '';
	
	db.collection('users').find({'email' : req.params.email}).toArray(function(err, items) {
		
		$.each(items, function() {
			
			test += this.name;
		});
	});
	
	test +=req.params.email;
	test += req.params.x;
	
	res.send(test);
});

module.exports = router;