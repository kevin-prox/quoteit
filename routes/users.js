var express = require('express');
var router = express.Router();
var ObjectId = require('mongoskin').ObjectID;

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
router.get('/user/:id', function(req, res) {
	var db = req.db;
	var idToFind = req.params.id;
	db.collection('users').findOne({ _id : ObjectId(idToFind) }, function(err, user) {
		res.json(user);
	});
});

module.exports = router;
