import { createServer } from "https";
import fs from "fs";
import next from "next";

const hostname = "https-test.p-e.kr";
const port = 443;

const app = next({ hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    try {
      createServer(
        {
          key: fs.readFileSync(
            "/etc/letsencrypt/live/https-test.p-e.kr/privkey.pem"
          ),
          cert: fs.readFileSync(
            "/etc/letsencrypt/live/https-test.p-e.kr/cert.pem"
          ),
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
      ).listen(port, () => {
        console.log(`> Ready on https://${hostname}:${port}`);
      });
    } catch (e) {
      (e) => console.error(e);
    }
  })
  .catch((e) => console.error(e));
