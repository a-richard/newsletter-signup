require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('https');

const app = express();
const { API_KEY: key, ID: id, PREFIX: prefix, PORT: port } = process.env;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

app.post('/', (req, res) => {
  const { fName, lName, email } = req.body;
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = `https://${prefix}.api.mailchimp.com/3.0/lists/${id}`;
  const options = {
    method: 'POST',
    auth: `key:${key}`,
  };

  const request = http.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(path.join(__dirname, 'success.html'));
    } else {
      res.sendFile(path.join(__dirname, 'failure.html'));
    }
  });

  request.write(jsonData);
  request.end();
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});

app.listen(port || 3000, () => {
  console.log('Server is up and running');
});
