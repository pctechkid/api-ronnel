// Import packages
const express = require("express");
const song = require("./routes/song");
const search = require("./routes/search");
const anime = require("./routes/anime");

// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use("/song", song);
app.use("/search", search);
app.use("/anime", anime);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
