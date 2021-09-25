import db from "./db";

const getError = (err) =>
  err.response && err.response.data && err.response.data.error
    ? err.response.data.error
    : err.message;

const onError = async (err, req, res, next) => {
  console.log(err);
  await db.disconnect();
  res.status(500).json({
    message: err.toString(),
  });
};

export { getError, onError };
