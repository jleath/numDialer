const express = require('express');
const cors = require('cors');
const axios = require('axios');
const config = require('./lib/constants');
const { logState } = require('./util/logger');

const app = express();
app.use(cors());
app.use(express.json());

const callDetails = config.NUMBERS.map(number => ({ number, id: undefined, status: 'idle' }));
let currNumberIndex = 0;

const placeCall = async (callDetails) => {
  const payload = {
    phone: callDetails.number,
    webhookURL: config.WEBHOOK_URL,
  }
  const url = `${config.NUM_DIALER_BASE_URI}/call`;
  const response = await axios.post(url, payload);
  callDetails.id = response.data.id;
};

const beginCalls = (req, res, next) => {
  for (; currNumberIndex < config.MAX_CONCURRENT; currNumberIndex++) {
    placeCall(callDetails[currNumberIndex]);
  }
  res.status(200).send();
};

const updateStatus = (req, res, next) => {
  const { id, status } = req.body;
  const call = callDetails.find(callData => callData.id === id);
  if (call.status !== 'completed') {
    call.status = status;
    if (status === 'completed' && currNumberIndex < callDetails.length) {
      placeCall(callDetails[currNumberIndex]);
      currNumberIndex++;
    }
  }
  logState(callDetails);
  res.status(200).send();
};

const getCallStatus = (req, res, next) => {
  const numberData = callDetails.map(({ number, status }) => ({ number, status }));
  res.json(numberData);
}

app.post('/beginCalls', beginCalls);
app.post('/webhooks', updateStatus);
app.get('/calls', getCallStatus);

app.listen(config.PORT, () => {
  console.log(`Listening on port ${config.PORT}`);
});