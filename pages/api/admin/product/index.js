import nc from "next-connect";

import { isAdmin, isAuth } from "../../../../utils/auth";

import Product from "../../../../models/Product";
import db from "../../../../utils/db";

const handler = nc();

handler.use(isAuth, isAdmin);

handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: "sample-name",
    slug: "sample-slug-" + Math.floor(Math.random() * 100),
    description: "sample-description",
    image: "/images/shirt1.jpg",
    price: 0,
    category: "sample-category",
    brand: "sample-brand",
    countInStock: 0,
    rating: 0,
    numReviews: 0,
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: "Product created successfully", product });
});

export default handler;
