var express = require('express');
var router = express.Router();
var ObjectId = require('mongoskin').ObjectID;

/*
 * GET quotes.
 */
router.get('/quotelist', function(req, res) {
	var db = req.db;	
	db.collection('quotes').find().sort({votes : -1}).toArray(function(err, items) {
		res.json(items);
	});
});

/*
 * POST to addquote.
 */
router.post('/addquote', function(req, res) {
	var db = req.db;
	db.collection('quotes').insert({'quote' : req.body.quote, 'user' : req.body.user, 'votes' : Number(req.body.votes)}, 
		function(err, result) {
		res.send((err === null) ? {
			msg : ''
		} : {
			msg : err
		});
	});
});

/*
 * GET userquotes.
 */
router.get('/userquotes/:user', function(req, res) {
	var db = req.db;
	var userToFind = req.params.user;
	db.collection('quotes').find({ user : userToFind }).toArray(function(err, items) {
		res.json(items);
	});
});

/*
 * POST to vote
 */
router.post('/vote', function(req, res) {
	var db = req.db;
	db.collection('quotes').update({ _id : ObjectId(req.body.id) }, { $inc : { votes : 1 } }, 
		function(err, result) {
		res.send((err === null) ? {
			msg : ''
		} : {
			msg : err
		});
	});
});

/*
 * DELETE to deletequote
 */
router.delete('/deletequote/:id', function(req, res) {
	var db = req.db;
	var quoteToDelete = req.params.id;
    db.collection('quotes').removeById(ObjectId(quoteToDelete), function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
