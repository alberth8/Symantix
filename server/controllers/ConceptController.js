var Concept = require('../models/ConceptModel.js');
var watson = require('watson-developer-cloud');

var alchemy_language = watson.alchemy_language({
  api_key: process.env.ALCHEMY_APIKEY
});

module.exports = {

	// through `alchemy_language`, concept data is obtained
	createConcept: function(req, res) { 

		var data = req.body.conceptData; // user's text
		console.log('req.body=conceptData=', req.body); // check! data comes through properly as string
		
		// parameters for API call
		var params = {
			maxRetrieve: 20, 
		  text: data // line 11
		}

		// when the data is returned, the callback gets executed, whence we save 
		// that returned data to our database -- each concept is it's own entry
		alchemy_language.concepts(params, function(err, watson_response) {
		  if (err) {
		    console.log('concept err: ', err);
		  } else {
		    console.log('concept: ', watson_response);

		    // putting each concept into it's own object so that it can be saved as an entry
		    for (var i = 0; i < watson_response.concepts.length; i++) { 
		    	var relevanceScore = watson_response.concepts[i].relevance;
		    	var conceptObj = {
		    		concept: watson_response.concepts[i].text,
		    		score: Math.round(relevanceScore * 100),
		    		userId: req.user.id,
		    		sessionId: req.body.sessionId 
		    	};


		    	new Concept(conceptObj).save()
	        .then(function(newConcept) {
	          res.status(201).send();
	        })
	        .catch(function(err) {
	          console.error(err);
	        });
		    }
			}
		});
	},
	getConcepts: function(req, res) {
		var queryObj = {
			sessionId: req.query.sessionId,
		}

		Concept.where(queryObj).fetchAll()
		  .then(function(concept) {
		  	console.log(concept.models);
		  	res.status(200).send(concept.models);
		  })
		  .catch(function(err) {
		  	res.status(500).send();
		  });
	}

}

