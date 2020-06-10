const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const port = process.env.PORT || 3000;
const environment = process.env.ENV;
const appVersion = process.env.APP_VERSION;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  const msg = 'Hello World! ' + appVersion + ' - ' + environment;
  res.end(msg);
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
