import nc from "next-connect";

import { isAdmin, isAuth } from "../../../../utils/auth";

import User from "../../../../models/User";
import db from "../../../../utils/db";

const handler = nc();

handler.use(isAuth, isAdmin);

handler.post(async (req, res) => {
  await db.connect();
  const newUser = new User({
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

  const user = await newUser.save();
  await db.disconnect();
  res.send({ message: "User created successfully", user });
});

handler.get(async (req, res) => {
  await db.connect();

  const users = await User.find({});

  await db.disconnect();

  res.send(users);
});

export default handler;
