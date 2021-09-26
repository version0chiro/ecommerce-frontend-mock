import jwt from "jsonwebtoken";

const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send("Access denied. No token provided");
  } else {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send("Invalid token");
      } else {
        req.user = decode;
        next();
      }
    });
  }
};
const isAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(401).send("Access denied. No token provided");
  } else {
    next();
  }
};

export { signToken, isAuth, isAdmin };
