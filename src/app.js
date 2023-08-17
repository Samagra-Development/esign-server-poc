const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const middlewares = require('./middlewares');
const eSign = require('./routes/eSign');
const bodyParser = require('body-parser');
const { clientGQL } = require('./utils');
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.json({
    message: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  });
});

app.post('/success', (req, res) => {
  console.log("SUCCESS REQ-->", req.body, req.headers, req.query, req.params)

  if (req.body.ReturnStatus == 'Success') {
    // Updating DB against Reference Number
    clientGQL(`mutation MyMutation {
      insert_esign_poc_one(object: {ref_number: "${req.body.Referencenumber}", transaction_number: "${req.body.Transactionnumber}", status: "${req.body.ReturnStatus}", signed_data: "${req.body.Returnvalue}"}) {
        id
        created_at
        transaction_number
        ref_number
      }
    }
    `, {});
  }
  res.send("<script>window.close();</script > ").status(200);
});

app.post('/failure', async (req, res) => {
  console.log("FAILURE REQ-->", req.body, req.headers, req.query, req.params)

  if (req.body.ReturnStatus == 'Failure') {
    // Updating DB against Reference Number
    clientGQL(`mutation MyMutation {
      insert_esign_poc_one(object: {error_message: "${req.body.ErrorMessage}", ref_number: "${req.body.Referencenumber}", transaction_number: "${req.body.Transactionnumber}", status: "${req.body.ReturnStatus}"}) {
        id
        created_at
        transaction_number
        ref_number
      }
    }
    `, {});

  }

  res.send("<script>window.close();</script > ").status(200);
});

app.use('/eSign', eSign);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
