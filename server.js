const express = require("express"),
  path = require("path");
const session = require("express-session");
let bodyParser = require("body-parser");
const mainRoutes = require("./routes/mainRoutes");
const cookies = require("cookie-parser");

let app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "Prueba",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookies());

app.use("/", mainRoutes);

var port = 3000;
app.listen(port, function (req, res) {
  console.log("Server is running at port: ", port);
});
