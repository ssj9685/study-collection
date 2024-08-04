// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: "John Doe" });
}

function test() {
  fetch("https://api.nolbal.com/home/nolportal/", {
    method: "GET",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Api-Version": "3",
      "Service-Name": "nolbal-web",
      "Service-Version": "3.7.0",
      Authorization:
        "JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMzU4ODEyLCJ1c2VybmFtZSI6ImFub255bW91c193ZWIiLCJleHAiOjE3MjI3NjQyMDAsIm9yaWdfaWF0IjoxNzIyNzUzNDAwLCJ0eXBlIjoxLCJsZXZlbCI6IjEiLCJpc19tZW1iZXIiOmZhbHNlfQ.033uZBSPmJqVgjZBPd9z_bqqPKNjD7rQsJ-HpCev6tQ",
      "P-Signature": `60142a19cbd6fa3b916928fcdddab757b7ab88678fb173128312cd70580b35317c83157ce62393d3f77e8e69a220339e79a566b2b93672e8c6e54fbf2538dcae;1722754266573`,
      Referer: "https://nolbal.com/",
    },
  }).then((res) => res.json().then((res) => console.log(res)));
}
