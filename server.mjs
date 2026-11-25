import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer, request as createRequest } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const frontend = path.join(root, "frontend");
const host = process.env.HOST ?? "0.0.0.0";
const port = Number(process.env.PORT ?? 5173);

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
]);

function sendText(response, status, message) {
  response.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(message);
}

function proxyApi(request, response) {
  const upstream = createRequest(
    {
      hostname: "127.0.0.1",
      port: 8000,
      path: request.url,
      method: request.method,
      headers: { ...request.headers, host: "127.0.0.1:8000" },
    },
    (upstreamResponse) => {
      response.writeHead(
        upstreamResponse.statusCode ?? 502,
        upstreamResponse.headers,
      );
      upstreamResponse.pipe(response);
    },
  );

  upstream.on("error", () => {
    if (!response.headersSent) {
      sendText(
        response,
        502,
        "Python API is unavailable. Start it with `npm run api`.",
      );
    } else {
      response.destroy();
    }
  });

  request.pipe(upstream);
}

async function serveStatic(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    sendText(response, 405, "Method not allowed.");
    return;
  }

  let pathname;

  try {
    pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
  } catch {
    sendText(response, 400, "Invalid URL.");
    return;
  }

  const relativePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.resolve(frontend, `.${relativePath}`);

  if (
    filePath !== frontend &&
    !filePath.startsWith(`${frontend}${path.sep}`)
  ) {
    sendText(response, 403, "Forbidden.");
    return;
  }

  try {
    const fileInfo = await stat(filePath);

    if (!fileInfo.isFile()) {
      sendText(response, 404, "Not found.");
      return;
    }

    response.writeHead(200, {
      "Content-Type":
        contentTypes.get(path.extname(filePath)) ??
        "application/octet-stream",
      "Content-Length": fileInfo.size,
      "Cache-Control": "no-cache",
    });

    if (request.method === "HEAD") {
      response.end();
    } else {
      createReadStream(filePath).pipe(response);
    }
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") {
      sendText(response, 404, "Not found.");
      return;
    }

    console.error("Could not serve frontend file:", error);
    sendText(response, 500, "Could not serve this page.");
  }
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid TCP port number.");
}

createServer((request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;

  if (pathname === "/api" || pathname.startsWith("/api/")) {
    proxyApi(request, response);
  } else {
    void serveStatic(request, response);
  }
  }).listen(port, "0.0.0.0", () => {
  console.log(`Portfolio frontend listening on 0.0.0.0:${port}`);
});
