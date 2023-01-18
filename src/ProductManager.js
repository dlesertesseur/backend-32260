const fs = require("fs");

class ProductManager {
  path;
  constructor(path) {
    this.path = path;
  }

  getNextId(ids) {
    let id = null;
    if(ids){
      if(ids.length > 0){
        const product = ids[ids.length-1];
        id = product.id + 1;
      }else{
        id = 1;
      }
    }
    return(id);
  }

  async addProduct(product) {
    const products = await this.getProducts();

    const ids = products.map((p) => p.code);
    if (ids.includes(product.code)) {
      console.log("duplicate code: " + product.code);
    } else {
      if (product.validate()) {
        product.id = this.getNextId(products);

        /*Agrega el producto*/
        try {
          products.push(product);
          await fs.promises.writeFile(this.path, JSON.stringify(products));
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("required values ->", product);
      }
    }
  }

  async getProducts() {
    let arr = [];
    try {
      const exist = fs.existsSync(this.path);
      if (!exist) {
        await fs.promises.writeFile(this.path, JSON.stringify(arr));
      }
      const ret = await fs.promises.readFile(this.path, "utf-8");
      arr = JSON.parse(ret);
    } catch (error) {
      console.log(error);
    }
    return arr;
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products?.find((product) => product.id === id);
    if (!product) {
      console.log("Not found");
    }
    return product;
  }

  async updateProduct(id, product) {
    const products = await this.getProducts();

    /*Toma el id del objecto*/
    const productFound = products?.find((p) => p.id === id);
    if (productFound) {
      /*Actualiza los campos que tiene valor*/
      productFound.title = product.title ? product.title : productFound.title;
      productFound.description = product.description
        ? product.description
        : productFound.description;
      productFound.price = product.price ? product.price : productFound.price;
      productFound.thumbnail = product.thumbnail
        ? product.thumbnail
        : productFound.thumbnail;
      productFound.code = product.code ? product.code : productFound.code;
      productFound.stock = product.stock ? product.stock : productFound.stock;

      const filteredProducts = products?.filter((product) => product.id !== id);
      filteredProducts.push(productFound);

      try {
        await fs.promises.writeFile(this.path, JSON.stringify(products));
      } catch (error) {
        console.log(error);
      }
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();

    /*Filtra el objecto con el id del parametro*/
    const filteredProducts = products?.filter((product) => product.id !== id);
    if (filteredProducts) {
      try {
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(filteredProducts)
        );
      } catch (error) {
        console.log(error);
      }
    }
  }
}

class Product {
  id;
  title;
  description;
  price;
  thumbnail;
  code;
  stock;

  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }

  validate() {
    let ret = this.title !== undefined;
    ret &= this.description !== undefined;
    ret &= this.price !== undefined;
    ret &= this.thumbnail !== undefined;
    ret &= this.code !== undefined;
    ret &= this.stock !== undefined;

    return ret;
  }
}

module.exports = { ProductManager, Product }