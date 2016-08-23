var Concept = require('../models/ConceptModel.js');
var watson = require('watson-developer-cloud');

var alchemy_language = watson.alchemy_language({
  api_key: process.env.ALCHEMY_APIKEY
});

// see very botton for notes for when you review this next time

module.exports = {

	// through `alchemy_language`, concept data is obtained
	createConcept: function(req, res) { 

		var data = req.body.conceptData; // user's text
		console.log('req.body=conceptData=', req.body); // check! data comes through properly as string
		
		// parameters for API call
		var params = {
			maxRetrieve: 10, 
		  text: data // line 11
		}

		// when the data is returned, the callback gets executed, whence we save 
		// that returned data to our database -- each concept is it's own entry
		alchemy_language.concepts(params, function(err, watson_response) {
			console.log('TRIGGERED');
		  if (err) {
		    console.log('concept err: ', err);
		  } else {
		    console.log('concept: ', watson_response);

		    // putting each concept into it's own object so that it can be saved as an entry
		    for (var i = 0; i < watson_response.concepts.length; i++) { 
		    	var relevanceScore = watson_response.concepts[i].relevance;
		    	var conceptObj = {
		    		concept: JSON.stringify(watson_response.concepts[i].text),
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


// In RecordView.jsx, we send the transcribed text to the endpoint /api/concept.
// In the route handler (api-routes.js), we invoke `createConcept`.
// It is here where the call to the watson API is made: `alchemy_language.graphs.annotateText()`.
// Note that concept insights is now depcreated, so I'll have to figure out how to do this with
// Alchemy Language, but that also have a concepts feature.
// I'll have to figure out how to console.log that data, so I can see how to manipulate it.
// Actually, what happens is when the session is ended (by clicking stop) ens automatically when I send that data
// Each concept should save to the db, just as we did with alchemy_language, HOWEVER,
// I should make a minor modification in that I should reduce any concepts that are the same, and sum
// their scores.
// Then in ConceptView.jsx, we make a get request to the endpoint /api/concept, but because it's a GET,
// we invoke `getConcepts()`, where we query the for ALL concepts with that sessionId.
// All of that is then returned back to the client where the D3 bubble chart is composed.
// Since I aggreagted the data in createConcepts(), I shouldn't have to worry about messing w/ D3.
// Of course, this is assuming the error is that I have duplicate data, and not with D3.

