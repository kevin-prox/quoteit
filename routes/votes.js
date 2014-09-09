var express = require('express');
var router = express.Router();

/*
 * GET votelist.
 */
router.get('/votelist/:user', function(req, res) {
	var db = req.db;
	db.collection('votes').find({'user' : req.params.user}).toArray(function(err, items) {
		res.json(items);
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
