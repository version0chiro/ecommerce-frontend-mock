import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../../utils/auth";
import User from "../../../../../models/User";
import db from "../../../../../utils/db";

const handler = nc();

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  await db.disconnect();
  res.send(user);
});

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    user.name = req.body.name;
    user.price = req.body.price;
    user.description = req.body.description;
    user.category = req.body.category;
    user.image = req.body.image;
    user.brand = req.body.brand;
    user.slug = req.body.slug;
    user.countInStock = req.body.countInStock;
    await user.save();
    res.send({ message: "User updated successfully" });
  } else {
    await db.disconnect();
    res.statusCode(404).send({ message: "User updated failed" });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    await user.remove();
    await db.disconnect();
    res.send({ message: "User deleted successfully" });
  } else {
    await db.disconnect();
    res.statusCode(404).send({ message: "User deleted failed" });
  }
});

export default handler;
