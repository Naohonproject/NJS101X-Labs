const { getDb } = require("../util/database");
const mongodb = require("mongodb");

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = new mongodb.ObjectId(id);
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      /** check that if instance that call save whether exist or not
       * if it existed, update it otherwise add it to Database
       */
      dbOp = db.collection("products").updateOne(
        {
          _id: this._id,
          /** filter to find the document to update */
        },
        {
          $set: this,
        } /** choose feilds to be updated, if update all of feilds, $set : this */
      ); /**return a promise */
    } else {
      /** this (instance of Product )  not exist yet => logic to add it to db when call save()*/
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp /** return dbOp, a promise */
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
