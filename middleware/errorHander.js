//not found

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); //pass error to error handler
};

//error handler
const errorHandler = (err, req, res, next) => {
  //set status code to 500 if status code is 200
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err?.message, //message from error
    stack: err?.stack, //stack trace
  });
};

module.exports = { notFound, errorHandler };
