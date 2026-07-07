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

app.get("/api/notes", (req, res) => {
  const notes = await
  res.json(notes);
})

app.put("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { x, y, width, height, content } = req.body;

  await db.query(
    `
    UPDATE notes
    SET x=?, y=?, width=?, height=?, content=?
    WHERE id=?
    `,
    [x, y, width, height, content, id],
  );

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
