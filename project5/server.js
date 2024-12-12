const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const nedb = require("@seald-io/nedb");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const nedbSessionStore = require("nedb-promises-session-store");
const bcrypt = require("bcrypt");

const urlEncodedParser = bodyParser.urlencoded({ extended: true });
const app = express();
const upload = multer({
  dest: "public/uploads",
});

let database = new nedb({
  filename: "database.txt",
  autoload: true,
});
let userdatabase = new nedb({
  filename: "userdb.txt",
  autoload: true,
});

const nedbSessionInit = nedbSessionStore({
  connect: expressSession,
  filename: "sessions.txt",
});

app.use(
  expressSession({
    store: nedbSessionInit,
    cookie: {
      maxAge: 365 * 24 * 60 * 60 * 1000,
    },
    secret: "supersecret123",
  })
);

app.use(express.static("public"));
app.use(urlEncodedParser);
app.use(cookieParser());
app.set("view engine", "ejs");

// Authentication
function requiresAuth(req, res, next) {
  if (req.session.loggedInUser) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.get("/", (req, res) => {
  res.render("publicGarden.ejs", {});
});

app.get("/secret-garden", requiresAuth, (req, res) => {
  let newVisits = 1;
  if (req.cookies.visits) {
    newVisits = parseInt(req.cookies.visits) + 1;
    res.cookie("visits", newVisits, {
      expires: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000),
    });
  } else {
    res.cookie("visits", 1, {
      expires: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000),
    });
  }

  let query = {};
  let sortQuery = {
    timestamp: -1, // sort in reverse chronological order
  };

  database
    .find(query)
    .sort(sortQuery)
    .exec((err, retreivedData) => {
      res.render("index.ejs", {
        posts: retreivedData,
        visitsToSite: newVisits,
      });
    });
});

app.post("/upload", requiresAuth, upload.single("theimage"), (req, res) => {
  const username = req.session.loggedInUser;
  let currDate = new Date();
  // Query the database to count user's existing images
  database.find({ username: username }, (err, posts) => {
    if (posts.length >= 3) {
      console.log("Image limit reached for user:", username);
      return res.redirect("/secret-garden");
    }

    let data = {
      date: currDate.toLocaleString(),
      timestamp: currDate.getTime(),
      image: "/uploads/" + req.file.filename,
    };
    database.insert(data, (err, newData) => {
      console.log("New image added:", newData);
      res.redirect("/secret-garden");
    });
  });
});

app.post("/remove", (req, res) => {
  let id = req.body.postId;
  let query = {
    _id: id,
  };

  database.remove(query, (err, numRemoved) => {
    console.log("num removed elements", numRemoved);
    res.redirect("/secret-garden");
  });
});

app.get("/post/:id", requiresAuth, (req, res) => {
  let id = req.params.id;

  console.log(id);

  let query = {
    _id: id,
  };

  database.findOne(query, (err, data) => {
    res.render("individualPost.ejs", { post: data });
  });
});

app.get("/register", (req, res) => {
  res.render("register.ejs", {});
});

app.get("/login", (req, res) => {
  res.render("login.ejs", {});
});

app.post("/signup", upload.single("profilePicture"), (req, res) => {
  let hashedPassword = bcrypt.hashSync(req.body.password, 10);

  let data = {
    username: req.body.username,
    fullname: req.body.fullname,
    password: hashedPassword,
  };

  userdatabase.insert(data, (err, insertedData) => {
    console.log(insertedData);
    res.redirect("/login");
  });
});

app.post("/authenticate", (req, res) => {
  // storing req body in local data obj
  let data = {
    username: req.body.username,
    password: req.body.password,
  };

  // query to search the db for a particular username
  let query = {
    username: data.username,
  };

  // searching the db for 1 username that matches
  userdatabase.findOne(query, (err, user) => {
    console.log("attempted login");
    // checks if error, or if user is not found
    if (err || user == null) {
      // redirects to login if user is not found
      res.redirect("/login");
    } else {
      // if user is found
      console.log("found user");
      // store the enc pass from the db in a local variable
      let encPass = user.password;

      // use bcrypt to compare the enc pass with the password from the attempted login
      if (bcrypt.compareSync(data.password, encPass)) {
        console.log("successful login");

        // get the current session from the request
        let session = req.session;
        // store the user that has logged in into the session
        session.loggedInUser = data.username;

        // direct to home page
        res.redirect("/secret-garden");
      } else {
        // if password fails, redirect back to login
        res.redirect("/login");
      }
    }
  });
});

app.get("/logout", requiresAuth, (req, res) => {
  delete req.session.loggedInUser;
  res.redirect("/");
});

app.listen(5001, () => {
  console.log("server started on port 5001");
});
