const { getDb } = require("../util/database");
const mongodb = require("mongodb");

class User {
  constructor(userName, userEmail, cart, id) {
    this.name = userName;
    this.email = userEmail;
    this.cart = cart;
    this_id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const cartProduct = this.cart.items.findIndex((item) => {
      return item._id === product._id;
    });

    const updatedCart = { items: [{ ...product, quantity: 1 }] };
    const db = getDb();
    return db.collection("users").updateOne(
      { _id: new mongodb.ObjectId(this._id) },
      {
        $set: { cart: updatedCart },
      }
    );
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
