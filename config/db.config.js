const mongoose = require('mongoose')

const DB_NAME = 'royalty';
const URI = process.env.MONGODB_URI || 'mongodb+srv://arturo:arturo@cluster0.9xvkf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const DB_URI = `${URI}/${DB_NAME}`;

mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.info(`Successfully connected to the database ${DB_URI}`))
  .catch((error) => {
    console.error(`An error ocurred trying to connect to de database ${DB_URI}`, error);
    process.exit(0);
  });

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});