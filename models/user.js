const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  Cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: String,
          required: true,
        },
      },
    ],
  },
});

module.exports = mongoose.model("User", UserSchema);

// const { getDb } = require("../util/database");
// const mongodb = require("mongodb");

// class User {
//   constructor(userName, userEmail, cart, id) {
//     this.name = userName;
//     this.email = userEmail;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     /**base logic is
//      * always update the cart , but the updatedCart will bahave two different way
//      * always make a shalow copy of current items array, to let we work with current items and updated items
//      * if the item was existing,
//      */
//     const cartProductIndex = this.cart.items.findIndex((item) => {
//       return (
//         item.productId.toString() === product._id.toString()
//       ); /**item.productId and product._id is not equal because they are two difference pointer , pointing to the two difference object */
//     });

//     let newQuantity = 1;
//     /**make of shalow copy */
//     const updatedCartItems = [...this.cart.items];
//     /** logic for update the quantity of the items that was existing */
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       /** logic for push a new one if not exist, we push to updatedCart */
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }
//     // update cart by  make a new cart that items will receive updateCartItem like value
//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     const db = getDb();
//     /**get user and update the cart */
//     return db.collection("users").updateOne(
//       { _id: new mongodb.ObjectId(this._id) },
//       {
//         $set: { cart: updatedCart },
//       }
//     );
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map((item) => {
//       return item.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((product) => {
//           return {
//             ...product,
//             quantity: this.cart.items.find((item) => {
//               return item.productId.toString() === product._id.toString();
//             }).quantity,
//           };
//         });
//       })
//       .catch((error) => console.log(error));
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectId(userId) })
//       .then((user) => {
//         console.log(user);
//         return user;
//       })
//       .catch((error) => console.log(error));
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartIems = this.cart.items.filter((item) => {
//       return item.productId.toString() !== productId.toString();
//     });

//     const db = getDb();
//     /**get user and update the cart */
//     return db.collection("users").updateOne(
//       { _id: new mongodb.ObjectId(this._id) },
//       {
//         $set: { cart: { items: updatedCartIems } },
//       }
//     );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then(() => {
//         this.cart = { items: [] };
//         return db.collection("users").updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           {
//             $set: { cart: { items: [] } },
//           }
//         );
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new mongodb.ObjectId(this._id) })
//       .toArray();
//   }
// }
// module.exports = User;
