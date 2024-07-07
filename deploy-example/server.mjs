import { createServer } from "https";
import next from "next";

const hostname = "https-test.p-e.kr";
const port = 443;

const app = next({ hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(
    {
      key: "/etc/letsencrypt/live/https-test.p-e.kr/privkey.pem",
      cert: "/etc/letsencrypt/live/https-test.p-e.kr/cert.pem",
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
});
