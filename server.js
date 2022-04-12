require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("> DB connection successfully"))
  .catch(() => console.log("> DB connection failed"));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`> App running on port ${port} ...`);
});
