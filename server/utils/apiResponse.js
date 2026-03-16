const success = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data });

const error = (res, message, statusCode = 500) =>
  res.status(statusCode).json({ success: false, error: message });

const unauthorized = (res, message = 'Unauthorized') =>
  error(res, message, 401);

const forbidden = (res, message = 'Forbidden') =>
  error(res, message, 403);

const notFound = (res, message = 'Not found') =>
  error(res, message, 404);

module.exports = { success, error, unauthorized, forbidden, notFound };
