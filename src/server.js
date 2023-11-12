import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer } from "vite";
import express from "express";

// eslint-disable-next-line no-undef
const isProduction = process.env.NODE_ENV === "production";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (p) => path.resolve(__dirname, p);

const getIndexHTML = async () => {
  const indexHTML = isProduction
    ? resolve("../dist/client/index.html")
    : resolve("../index.html");
  const html = await fs.promises.readFile(indexHTML, "utf-8");

  return html;
};

async function start() {
  const manifest = isProduction
    ? JSON.parse(fs.readFileSync(resolve("../dist/client/ssr-manifest.json"), "utf-8"))
    : null;
  const app = express();
  const router = express.Router();
  let vite = null;

  if (isProduction) {
    app.use(express.static("dist/client", { index: false }));
  } else {
    vite = await createServer({
      // eslint-disable-next-line no-undef
      root: process.cwd(),
      server: { middlewareMode: true },
      appType: "custom"
    });

    app.use(vite.middlewares);
  }

  router.get("/*", async (req, res, next) => {
    try {
      const url = req.url;
      let template = await getIndexHTML();
      let render = null;

      if (isProduction) {
        render = (await import("../dist/server/main-server.js")).render;
      } else {
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule(resolve("./main-server.js"))).render;
      }

      const [appHtml, preloadLinks] = await render(url, manifest);
      const html = template
        .replace("<!--preload-links-->", preloadLinks)
        .replace("<!--app-html-->", appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (error) {
      if (vite) {
        vite.ssrFixStacktrace(error);
      }

      next(error);
    }
  });

  app.use("/", router);
  app.listen(3000, () => {
    console.log("Server started on: http://localhost:3000/");
  });
}

start();
