const { getDb } = require("../util/database");
const mongodb = require("mongodb");

class User {
  constructor(userName, userEmail) {
    this.name = userName;
    this.email = userEmail;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((error) => console.log(error));
  }
}
module.exports = User;
