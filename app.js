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

const getResourceIndex = (resourceName, req, res) => {
  const { id } = req.params;
  const resource = readResource(resourceName);
  let index;
  for (let i = 0; i < resource.length; i++) {
    const elem = resource[i];
    if (elem.id === Number(id)) {
      index = i;
      break;
    }
  }
  if (index === undefined) {
    res.status(404).send("No resource found");
    return [];
  }
  return [resource[index], index];
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
    const singleResource = resource.filter((r) => r.id === Number(id));
    if (!singleResource) {
      res.status(404).send(`Resource with id ${id} not found`);
      return;
    }
    res.send(singleResource);
  });
  // PUT resources/:id
  app.put(`/${resourceName}/:id`, (req, res) => {
    const newResource = req.body;
    let isValid = true;
    isValid &= Object.keys(newResource).length === properties.length;
    if (isValid) {
      properties.forEach((key) => {
        isValid &= newResource[key] !== undefined;
      });
    }
    if (!isValid) {
      res.status(400).send(`Resource must have properties: ${properties}`);
      return;
    }
    const [, index] = getResourceIndex(resourceName, req, res);
    const resources = readResource(resourceName);
    newResource.id = Number(req.params.id);
    resources[index] = newResource;
    writeResource(resourceName, resources);
    res.send(resources);
  });
  // PATCH resources/:id
  app.patch(`/${resourceName}/:id`, (req, res) => {
    const newResource = req.body;
    const keys = Object.keys(newResource);
    if (keys.length >= properties.length) {
      res
        .status(400)
        .send(`You cannot change more than ${properties.length - 1}`);
      return;
    }
    let isValid = true;
    if (isValid) {
      keys.forEach((key) => {
        isValid &= properties.includes(key);
      });
    }
    if (!isValid) {
      res.status(400).send(`Properties to change must be: ${properties}`);
    }
    const [, index] = getResourceIndex(resourceName, req, res);
    const resources = readResource(resourceName);
    newResource.id = Number(req.params.id);
    resources[index] = {...resources[index], ...newResource};
    writeResource(resourceName, resources);
    res.send(resources);
  });
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

setResource("books", [
  "title",
  "author",
  "year",
  "synopsis",
  "img",
  "status",
  "series",
]);
