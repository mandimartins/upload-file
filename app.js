function init(db) {
  const path = require("path");
  const { v4: uuidv4 } = require("uuid");
  const express = require("express");
  const multer = require("multer");

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "/static/"));
    },
    filename: function (req, file, cb) {
      cb(null, `${uuidv4()}_${file.originalname}`);
    },
  });

  const upload = multer({ storage: storage });

  const app = express();

  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.static(path.join(__dirname, "static")));

  app.use(express.urlencoded({ extended: true }));

  app.set("view engine", "ejs");
  app.set("views", "./views");

  app.get("/", async (req, res) => {
    const product = await db("product")
      .where({ id: 1 })
      .select("name", "price", "description", "img");

    if (product.length === 0) {
      return res.render("index", {
        img: "default.png",
        name: "Titulo",
        price: "R$ 000,00",
        description: "Informação adicional",
      });
    }

    return res.render("index", {
      img: product[0].img,
      name: product[0].name,
      price: product[0].price,
      description: product[0].description,
    });
  });

  app.post(
    "/admin/produto/cadastrar",
    upload.single("avatar"),
    async (req, res) => {
      try {
        await db("product").insert({
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          img: req.file.filename,
        });

        return res.redirect("/");
      } catch (error) {
        console.log(error);
        return res.status(500).send("server error");
      }
    }
  );

  return app;
}

module.exports = init;
