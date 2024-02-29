const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);

let leet = require("./api");
app.get("/", (req, res) => {
  res.send(
    `<b style="color:green;">API is working. Add your leetcode username after / api end point.</b>`
  );
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .send('<b style="color:crimson;">API not working properly.</b>');
});

app.get("/:id", leet.leetcode);

app.listen(3000, () => {
  console.log(`App is running on port 3000`);
});
