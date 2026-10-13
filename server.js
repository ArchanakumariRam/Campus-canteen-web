// Campus Canteen Pro - Zero-Dependency Local Static Web Server
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split("?")[0]);
  if (reqPath === "/" || reqPath === "") reqPath = "/index.html";

  const filePath = path.join(BASE_DIR, reqPath);

  // Security check: ensure path stays within base directory
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("403 Forbidden");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      return res.end("<h1>404 Not Found</h1><p><a href='/'>Go to RIT Canteen Pro</a></p>");
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache"
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🍽️  RIT CANTEEN PRO IS RUNNING LIVE!`);
  console.log(`🚀  Local URL: http://localhost:${PORT}`);
  console.log(`📂  Serving from: ${BASE_DIR}`);
  console.log(`💡  Zero external dependencies. Portable & Shareable!`);
  console.log(`======================================================\n`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`Port ${PORT} is busy, retrying on port ${Number(PORT) + 1}...`);
    server.listen(Number(PORT) + 1);
  } else {
    console.error("Server error:", err);
  }
});
