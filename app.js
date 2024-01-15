import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import Book from "./models/book.js";
import dotenv from "dotenv";
dotenv.config();
const { MONGO_URI } = process.env;

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// GET all resources
app.get(`/books`, async (req, res) => {
  try {
    const books = await Book.find();
    res.send(books);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// POST all resources
app.post(`/books`, async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.send(book);
  } catch (err) {
    res.status(400).send(err.message);
  }
});
// GET resources/:id
app.get(`/books/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    res.send(book);
  } catch (err) {
    res.status(404).send(`Resource not found`);
  }
});
// PUT resources/:id
app.put(`/books/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndUpdate(id, req.body);
    const book = await Book.findById(id);
    res.send(book);
  } catch (err) {
    res.status(404).send(err.message);
  }
});
// PATCH resources/:id
app.patch(`/books/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndUpdate(id, req.body);
    const book = await Book.findById(id);
    res.send(book);
  } catch (err) {
    res.status(404).send(err.message);
  }
});
// DELETE resources/:id
app.delete(`/books/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.send("Book deleted successfully");
  } catch (err) {
    res.status(404).send(err.message);
  }
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server active at port 3000");
    });
  })
  .catch((err) => console.error(err));
