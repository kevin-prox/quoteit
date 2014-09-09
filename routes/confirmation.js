var express = require('express');
var router = express.Router();
var ObjectId = require('mongoskin').ObjectID;

/*
 * GET newuser.
 */
router.get('/newuser/:email/:code', function(req, res) {
	var db = req.db;
	db.collection('users').find({'email' : req.params.email}).toArray(function(err, items) {
		$.each(items, function() {
			
			// If code sent matches code stored, then mark user as verified
			if (this.code === req.params.code) {
				
				db.collection('users').update({ email : req.params.email }, { verif : "Y" });
			}
		});
	});
});

/*
 * POST to addvote.
 */
router.post('/addvote', function(req, res) {
	var db = req.db;
	db.collection('votes').insert(req.body, function(err, result) {
		res.send((err === null) ? {
			msg : ''
		} : {
			msg : err
		});
	});
});

module.exports = router;