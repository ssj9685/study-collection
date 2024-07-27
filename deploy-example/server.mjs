import { createServer } from "https";
import fs from "fs";
import next from "next";

const hostname = "deploy-test3.p-e.kr";
const port = 3000;

const app = next({ hostname, port });
const handle = app.getRequestHandler();

const key = fs.readFileSync(
  `/etc/letsencrypt/live/${hostname}/privkey.pem`,
  { encoding: "utf-8" }
);

const cert = fs.readFileSync(
  `/etc/letsencrypt/live/${hostname}/cert.pem`,
  { encoding: "utf-8" }
);

app
  .prepare()
  .then(() => {
    try {
      createServer(
        {
          key,
          cert,
        },
        async (req, res) => {
          try {
            await handle(req, res);
          } catch (err) {
            console.error("Error occurred handling", req.url, err);
            res.statusCode = 500;
            res.end("internal server error");
          }
        }
      )
        .once("error", (err) => {
          console.error(err);
          process.exit(1);
        })
        .listen(port, () => {
          console.log(`> Ready on https://${hostname}:${port}`);
        });
    } catch (e) {
      console.error(e);
    }
  })
  .catch((e) => console.error(e));
