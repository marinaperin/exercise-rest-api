import mongoose from "mongoose";

const { Schema, model } = mongoose;

const bookSchema = new Schema({
  title: String,
  author: String,
  year: Number,
  synopsis: String,
  img: String,
  status: String,
  series: String,
});

const Book = model("Romantasy", bookSchema);

export default Book;
