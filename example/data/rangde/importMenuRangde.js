const fs = require("fs");
const mysql = require("mysql2/promise");

async function run() {

  const db = await mysql.createConnection({
    host: "sv63.ifastnet12.org",
    user: "masakali_kiran",
    password: "K143iran",
    database: "masakali_california",
    port: 3306
  });

  const raw = fs.readFileSync("./rangde_data.json");
  const data = JSON.parse(raw);

  console.log("Importing categories...");

  for (const key in data.categories) {
    const c = data.categories[key];

    await db.execute(
      `INSERT INTO temp_categories_rangde (id,name,sort_order)
       VALUES (?,?,?)`,
      [c.id, c.name, c.sortOrder]
    );
  }

  console.log("Importing items...");

  for (const item of data.items) {

    await db.execute(
      `INSERT INTO temp_items_rangde
      (id,name,description,price,available)
      VALUES (?,?,?,?,?)`,
      [
        item.id,
        item.name,
        item.description,
        item.price / 100,
        item.available
      ]
    );

    if (item.images && item.images.length > 0) {

      const img =
        item.images.find(i => i.name === "large_1x1") ||
        item.images[0];

      await db.execute(
        `INSERT INTO temp_item_images_rangde
        (item_id,image_url)
        VALUES (?,?)`,
        [item.id, img.source]
      );
    }

    for (const catId of item.categoryIds) {

      await db.execute(
        `INSERT INTO temp_category_items_rangde
        (category_id,item_id)
        VALUES (?,?)`,
        [catId, item.id]
      );
    }
  }

  console.log("✅ Rangde menu imported successfully");

  await db.end();
}

run();