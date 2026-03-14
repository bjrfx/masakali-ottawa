const fs = require("fs");
const mysql = require("mysql2/promise");

async function run() {

  try {

    const db = await mysql.createConnection({
      host: "sv63.ifastnet12.org",
      user: "masakali_kiran",
      password: "K143iran",
      database: "masakali_california",
      port: 3306
    });

    console.log("Connected to database");

    /* CLEAR TABLES */

    await db.execute("SET FOREIGN_KEY_CHECKS = 0");

    await db.execute("TRUNCATE temp_category_items_restobar");
    await db.execute("TRUNCATE temp_item_images_restobar");
    await db.execute("TRUNCATE temp_items_restobar");
    await db.execute("TRUNCATE temp_categories_restobar");

    await db.execute("SET FOREIGN_KEY_CHECKS = 1");

    console.log("Tables cleared");

    /* LOAD JSON */

    const raw = fs.readFileSync("./restobar_data.json");
    const data = JSON.parse(raw);

    /* INSERT CATEGORIES */

    console.log("Importing categories...");

    for (const key in data.categories) {

      const c = data.categories[key];

      await db.execute(
        `INSERT INTO temp_categories_restobar
        (id,name,sort_order)
        VALUES (?,?,?)`,
        [
          c.id,
          c.name || null,
          c.sortOrder || 0
        ]
      );
    }

    /* INSERT ITEMS */

    console.log("Importing items...");

    for (const item of data.items) {

      await db.execute(
        `INSERT INTO temp_items_restobar
        (id,name,description,price,available)
        VALUES (?,?,?,?,?)`,
        [
          item.id,
          item.name || null,
          item.description || null,
          item.price ? item.price / 100 : null,
          item.available ?? true
        ]
      );

      /* INSERT IMAGE */

      if (item.images && item.images.length > 0) {

        const img =
          item.images.find(i => i.name === "large_1x1") ||
          item.images[0];

        await db.execute(
          `INSERT INTO temp_item_images_restobar
          (item_id,image_url)
          VALUES (?,?)`,
          [
            item.id,
            img?.source || null
          ]
        );
      }

      /* INSERT CATEGORY RELATIONS */

      if (item.categoryIds && item.categoryIds.length > 0) {

        for (const catId of item.categoryIds) {

          await db.execute(
            `INSERT INTO temp_category_items_restobar
            (category_id,item_id)
            VALUES (?,?)`,
            [
              catId,
              item.id
            ]
          );

        }

      }

    }

    console.log("✅ Restobar menu imported successfully");

    await db.end();

  } catch (err) {

    console.error("Import failed:", err);

  }

}

run();