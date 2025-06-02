const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { handleSignal } = require('./tradeEngine');

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.post('/signal', async (req, res) => {
  const signal = req.body;
  if (!signal || !signal.coin || !signal.type) {
    return res.status(400).send({ error: 'Invalid signal payload' });
  }

  try {
    await handleSignal(signal);
    res.status(200).send({ message: 'Signal processed successfully' });
  } catch (error) {
    console.error('Signal error:', error);
    res.status(500).send({ error: 'Signal processing failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MEXC AutoTrade backend listening on port ${PORT}`);
});