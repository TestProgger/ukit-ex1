const express = require("express");
const app = express();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const fs = require("fs");

// Const variables
const port = 3000;
const sourceFile = "file.doc";
const secretKey = "secret-key";

// Configs
app.use(helmet());
app.use(cookieParser(secretKey));

// Routes
app.get("/", async (request, response) => {
  const newFileName = request.query.filename;

  if (!newFileName) {
    response.statusCode = 404;
    return response.send(
      `<h1>Error: filename is empty</h1> <p>Example: http://localhost:${port}/?filename=blablabla</p>`
    );
  }

  response.cookie(
    "referrer",
    request.headers.referer || `Referer_not_found_${request.url}`,
    {
      expires: new Date(Date.now() + 3600 * 1000),
      httpOnly: true,
      secure: true,
      signed: true,
    }
  );
  response.download(sourceFile, newFileName, (error) => {
    if (error) {
      response.statusCode = 404;
      return response.send("<h1>Resourse not found</h1>");
    }
  });
});

app.listen(port, () => {
  console.log( `Listening on : http://localhost:${port}` );
});
