const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Порт из переменной окружения или 3000
const PORT = process.env.PORT || 3000;

// Подключение к MongoDB
mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://castusartorius:9oernH2rTKBg6Mwn@cluster0.f97ic.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Создание схемы и модели для заметок
const noteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);

// Настройки приложения
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Маршрут для отображения заметок
app.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.render("index", { notes });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});

// Маршрут для добавления новой заметки
app.post("/add-note", async (req, res) => {
  try {
    const newNote = new Note({ content: req.body.note });
    await newNote.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка при добавлении заметки");
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
