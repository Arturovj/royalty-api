const mongoose = require('mongoose')

const DB_NAME = 'royalty';
const URI = process.env.MONGODB_URI || '';
// const DB_URI = `${URI}/${DB_NAME}`;

mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.info(`Successfully connected to the database ${URI}`))
  .catch((error) => {
    console.error(`An error ocurred trying to connect to de database ${URI}`, error);
    process.exit(0);
  });

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});