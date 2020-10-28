const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: process.env.KEY_CLARIFAI
});

const handleApiCall = (req, res) => {
	app.models.predict(Clarifai.DEMOGRAPHICS_MODEL, req.body.input)
	.then(data => res.json(data))
	.catch(err => res.status(400).json('Unable to work with API'))
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users')
	  .where('id', '=', id)
	  .increment('entries', 1).returning('entries').then(count => {
	  	if(count.length) {
	  		res.json(count[0]);	
	  	} else {
	  		res.status(404).json('user not found');
	  	}
	  	
	  }
	).catch(err => res.status(404).json(err));
}
module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
}