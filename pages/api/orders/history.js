import nc from "next-connect";
import Order from "../../../models/Order";
import { isAuth } from "../../../utils/auth";
import db from "../../../utils/db";
import { onError } from "../../../utils/error";

const handler = nc({
  onError,
});
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  console.log("req.user", req.user);
  const orders = await Order.find({ user: req.user._id });
  console.log("orders", orders);
  res.send(orders);
});

export default handler;
