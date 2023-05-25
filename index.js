const express = require("express");
const cors = require("cors");
const path = require('path');
const Firestore = require("@google-cloud/firestore");
const routes = require("./routes/routes");

const app = express();


app.use(express.json());
// Enable CORS for all routes
app.use(cors());

//My routes are all that
app.use('/', routes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Barkbark rest api is listening at the: ${port}`);
});




