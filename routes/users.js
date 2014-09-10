var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/users', function(req, res) {
	var db = req.db;
	db.collection('users').find().toArray(function(err, items) {
		res.json(items);
	});
});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
	var db = req.db;
	db.collection('users').insert(req.body, function(err, result) {
		res.send((err === null) ? {
			msg : ''
		} : {
			msg : err
		});
	});
});

/*
 * GET user.
 */
router.get('/user/:email', function(req, res) {
	var db = req.db;
	var emailToFind = req.params.email;
	db.collection('users').findOne({ email : emailToFind }, function(err, user) {
		res.json(user);
	});
});

module.exports = router;
