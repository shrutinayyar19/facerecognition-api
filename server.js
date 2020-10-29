const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
      connectionString: process.env.DATABASE_URL,
	  ssl: {
	    rejectUnauthorized: false
	  }
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	db.select('*')
	.from('users')
	.then(users => res.json(users))
	.catch(err => res.status(404).json('unable to fetch users'));
});

app.post('/signin', (req, res) => {
	signin.handleSignin(req, res, db, bcrypt);
})

app.post('/register', (req, res) => {
	register.handleRegister(req, res, db, bcrypt);
})

app.get('/profile/:id', (req, res) => {
	profile.handleProfileGet(req, res, db);
});

app.put('/image', (req, res) => {
	image.handleImage(req, res, db);
});

app.post('/imageUrl', (req, res) => {
	image.handleApiCall(req, res);
});


app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}.`);
})
/*
/ --> this is working
/signin --> POST --> Success/Fail
/register --> POST --> user
/profile/:userid --> GET --> user
/image --> PUT --> user
*/