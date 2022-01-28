require("dotenv/config");
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

const routes = express.Router();

routes.get("/", async (_, res) => {
  const posts = await prisma.post.findMany({
    include: {
      user: true,
    },
  });

  return res.json({
    result: posts,
  });
});

routes.post("/", async (req, res) => {
  const { name, title, body } = req.body;

  const post = await prisma.post.create({
    data: {
      body,
      title,
      user: {
        create: {
          name,
        },
      },
    },
  });

  return res.json({
    result: post,
  });
});

app.use("/post", routes);

app.listen(process.env.PORT | 3333, () => {
  console.log("Server started");
});
