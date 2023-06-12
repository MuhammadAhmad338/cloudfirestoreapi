const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");
const authRouter = require("./routes/authRoutes");
const app = express();

app.use(express.json());
// Enable CORS for all routes
app.use(cors());

app.use('/', authRouter);
app.use('/', routes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Barkbark rest api is listening at the: ${port}`);
});