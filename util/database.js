const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://letuanbao:SByQsXUanGc1VnuZ@cluster0.4ewgxhk.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      _db = client.db("NJS101X");
      callback();
    })
    .catch((err) => {
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
