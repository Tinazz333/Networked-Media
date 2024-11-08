require("dotenv").config();
const m = require("masto");
const masto = m.createRestAPIClient({
  url: "https://networked-media.itp.io/",
  accessToken: process.env.TOKEN,
});

async function makeStatus(text) {
  const status = await masto.v1.statuses.create({
    status: text,
    visibility: "public",
  });
  console.log(status.url);
}
// makeStatus("hello my first status");

function multipleStatuses() {
  let names = ["HiHHiHHHi!", "HEREHEHEER IS!", "TINANANA!"];
  let rand = Math.floor(Math.random() * names.length);
  let post = names[rand];
  makeStatus(post);
}
// setInterval(multipleStatuses, 90000);
setInterval(multipleStatuses, 900000);

