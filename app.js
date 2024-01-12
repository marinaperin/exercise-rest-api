import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";

const readResource = (resourceName) => {
  const data = fs.readFileSync(
    path.resolve(`./database/${resourceName}.json`),
    "utf-8"
  );
  const resource = JSON.parse(data);
  return resource;
};

const writeResource = (resourceName, resource) => {
  const data = JSON.stringify(resource);
  fs.writeFileSync(path.resolve(`./database/${resourceName}.json`), data);
};

const idGenerator = (resourceName) => {
  const resource = readResource(resourceName);
  const ids = resource.map((r) => r.id);
  for (let i = 0; i <= resource.length; i++) {
    if (!ids.includes(i)) {
      return i;
    }
  }
};



const app = express();

app.listen(3000, () => {
  console.log("Server active at port 3000");
});

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
