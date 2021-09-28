import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../../utils/auth";
import Product from "../../../../../models/Product";
import db from "../../../../../utils/db";

const handler = nc();

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

handler.put(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    product.name = req.body.name;
    product.price = req.body.price;
    product.description = req.body.description;
    product.category = req.body.category;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.slug = req.body.slug;
    product.countInStock = req.body.countInStock;
    await product.save();
    res.send({ message: "Product updated successfully" });
  } else {
    await db.disconnect();
    res.statusCode(404).send({ message: "Product updated failed" });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await product.remove();
    await db.disconnect();
    res.send({ message: "Product deleted successfully" });
  } else {
    await db.disconnect();
    res.statusCode(404).send({ message: "Product deleted failed" });
  }
});

export default handler;
