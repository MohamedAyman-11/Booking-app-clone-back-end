const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });
const dns = require('node:dns');
const mongoose = require('mongoose');
// Use Cloudflare DNS to improve Atlas DNS resolution
// dns.setServers(['1.1.1.1', '1.0.0.1']);
const PORT = process.env.PORT || 3000;
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB)
  .then(async () => {
    console.log('Connected to DB.');
    require('./src/cron/bookingStatus');
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });
const app = require('./app');
