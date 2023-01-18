const express = require("express");
const { ProductManager, Product } = require("./ProductManager.js");

const app = express();

const server = app.listen(8080, () => {
  console.log("Server listening on port 8080");
});

app.get("/products", async (req, res) => {
  const limit = req.query.limit;
  const pm = new ProductManager("./data/productos.json");
  let products = await pm.getProducts();

  if(limit){
    products.splice(limit);
  }

  res.send(products);
});

app.get("/products/:pid", async (req, res) => {
  const param = req.params.pid;
  const pid = parseInt(param);

  const pm = new ProductManager("./data/productos.json");
  let product = await pm.getProductById(pid);

  if(product){
    res.send(product);
  }else{
    res.send({id:pid, error:"Not found"});
  }
});

server.on("error", (error) => {
  console.log(error);
});
