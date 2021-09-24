import db from "./db";

const getError = (err) =>
  err.response && err.response.data && err.response.data.error
    ? err.response.data.error
    : err.message;

const onError = async (err, req, res, next) => {
  await db.disconnect();
  console.log(err);
  res.status(500).json({
    message: err.toString(),
  });
};

export { getError, onError };
