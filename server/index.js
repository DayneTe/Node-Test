const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
  }),
);

//Route
app.get("/", (req, res) => {
  res.send("wecole");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "hello" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
