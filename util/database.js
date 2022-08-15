const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://letuanbao:SByQsXUanGc1VnuZ@cluster0.4ewgxhk.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("connected");
      callback(client);
    })
    .catch((err) => console.log(err));
};

module.exports = mongoConnect;
