require('dotenv').config();

const cron = require('cron');
const axios = require('axios');

const URL = process.env.API_URL + '/ping';

const job = new cron.CronJob('*/10 * * * *', () => {
  console.log('Make request to', URL);
  console.log('Restarting server');

  axios
    .get(URL)
    .then(res => {
      console.log('Server restarted');
      console.log(res.data);
    })
    .catch(error => {
      console.log('Error during Restart\n', error);
    });
});

module.exports = { job };
