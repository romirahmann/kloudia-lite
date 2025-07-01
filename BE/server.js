const { server } = require("./src/app");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 3000;

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
