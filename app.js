const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//   User.findById("62fc0ed28b75ff34465120a9")
//     .then((user) => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       console.log(user);
//       console.log(req.user);
//       next();
//     })
//     .catch((error) => console.log(error));
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://letuanbao:SByQsXUanGc1VnuZ@cluster0.4ewgxhk.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => console.log(error));
