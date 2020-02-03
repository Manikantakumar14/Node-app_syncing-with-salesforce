const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const errorController = require("./controllers/error");
const shopController = require('./controllers/shop');
const isAuth = require('./middleware/is-auth');
const db = require("./util/database");
const User = require("./models/user");

const app = express();
const store = new MySQLStore({
  host: "us-cdbr-iron-east-05.cleardb.net",
  user: "b6515ab5d034d1",
  password: "40c37bd7",
  database: "heroku_688015b789a3131",
  createDatabaseTable: true,
  clearExpired: true,
  checkExpirationInterval: 900000
});

const csrfProtection = csrf();




app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(helmet());
app.use(compression());
app.use(morgan('combined'));


app.use(bodyParser.urlencoded({ extended: false }));
// app.use(
//   multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
// );
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);


app.use(flash());

// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isLoggedIn;
//   next();
// });

// app.use((req, res, body) => {
//   // throw new Error('Sync dummy');
//   console.log(req.session.user[0].id);
//     if(!req.session.user) {
//         return next();

//     }
//     User.findById(req.session.user[0].id)
//     .then(user => {

//       throw new Error('Async Dummy');
//       if(!user){
//         return next();
//       }
//         req.user= user;
//       next();
//     })
//     .catch(err => {
//       //"next" required for async errors from 'then' blocks and promises.
//       // no next required for sync errors.. sync errors will eventually end up in catch block.
//        //const error = new Error(err);
//        next(new Error(err));
//     });
// });

// app.post('/create-order', isAuth, shopController.postOrder);

// app.use(csrfProtection); //Using csrf protection after create order route to exclude csrf from stripe payment
// app.use((req, res, next) => {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get("/500", errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  //res.status(error.httpStatusCode).render(..);
  //res.redirect('/500');
  console.log(error);
  res.status(500).render("500", {
    pageTitle: "Error",
    path: "/500",
    // isAuthenticated: req.session.isLoggedIn
  });
});

app.listen(process.env.PORT || 5000);
