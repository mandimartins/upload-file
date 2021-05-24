const knex = require("knex");

const app = require("./app");

const connection = knex({
  client: "sqlite3",
  connection: {
    filename: "./database/products.db",
  },
  useNullAsDefault: true,
});

connection.schema.hasTable("product").then((exists) => {
  if (!exists) {
    return connection.schema.createTable("product", (table) => {
      table.increments();
      table.string("name");
      table.string("price");
      table.string("description");
      table.string("img");
    });
  }
});

const PORT = process.env.PORT || 5000;

app(connection).listen(PORT);
