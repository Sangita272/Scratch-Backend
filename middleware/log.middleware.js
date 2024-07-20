const jwt = require("jsonwebtoken");
const logger = require("../utils/logger").build({
  fileName: "api-logs",
  level: "info",
  type: "monthly",
});

// Create a middleware function to log requests and responses
const logMiddleware = async (req, res, next) => {
  try {
    logger.info("--------------- Request : Start ------------------");
    // Log the request method and URL
    logger.info(`${req.method} ${req.url}`);

    // Log request headers
    logger.info("Request Headers: ", req.headers);

    // Log request body (if any)
    if (req.body) logger.info("Request Body {} : ", req.body);

    if (req.headers["authorization"]) {
      const token = req.headers["authorization"].split(" ")[1];
      if (token) {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        logger.info("Authenticate User {} ", user);
      }
    }

    // Capture the response object's original `end` function
    const originalEnd = res.end;

    // Create a function to intercept the response content and log it
    res.end = function (chunk, encoding) {
      // Log the response status code
      logger.info(`Response Status Code: ${res.statusCode}`);

      // Log response headers
      logger.info("Response Headers {} : ", res.getHeaders());

      // Log response body (if any)
      if (chunk) {
        logger.info("Response Body : ", chunk.toString());
      }

      // Call the original `end` function to send the response
      logger.info("--------------- Request : End ------------------");
      originalEnd.call(this, chunk, encoding);
    };

    // Continue processing the request
    next();
  } catch (err) {
    next();
  }
};

module.exports = { logMiddleware };