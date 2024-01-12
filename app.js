import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import cors from "cors";

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

const setResource = (resourceName, properties) => {
  // GET all resources
  app.get(`/${resourceName}`, (req, res) => {
    res.sendFile(path.resolve(`./database/${resourceName}.json`));
  });
  // POST all resources
  app.post(`/${resourceName}`, (req, res) => {
    const newResource = req.body;
    let isValid = true;
    [properties].forEach((key) => {
      isValid && newResource[key] !== undefined;
    });
    if (!isValid) {
      res.status(400).send(`Resource must have properties: ${properties}`);
      return;
    }
    const resources = readResource(resourceName);
    newResource.id = idGenerator(resourceName);
    resources.push(newResource);
    writeResource(resourceName, resources);
    res.send(resources);
  });
  // GET resources/:id
  app.get(`/${resourceName}/:id`, (req, res) => {
    const { id } = req.params;
    const resource = readResource(resourceName);
    const singleResource = resource.filter((r) => r.id === Number(id));
    if (!singleResource) {
      res.status(404).send(`Resource with id ${id} not found`);
      return;
    }
    res.send(singleResource);
  });
  // PUT resources/:id
  app.put(`/${resourceName}/:id`, (req, res) => {
    
  })
};

const app = express();

app.listen(3001, () => {
  console.log("Server active at port 3001");
});

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

setResource("books", [
  "title",
  "author",
  "year",
  "synopsis",
  "img",
  "status",
  "series",
]);
