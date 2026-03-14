app.get('/api/menu', async (req, res) => {

  if (!db) {
    return res.status(500).json({ error: "Database not connected" });
  }

  try {

    const [rows] = await db.query(`
      SELECT
        c.id AS category_id,
        c.name AS category_name,
        c.sort_order,

        i.id AS item_id,
        i.name AS item_name,
        i.description,
        i.price,
        i.available,

        img.image_url

      FROM temp_category_items_stittsville ci

      JOIN temp_categories_stittsville c
        ON ci.category_id = c.id

      JOIN temp_items_stittsville i
        ON ci.item_id = i.id

      LEFT JOIN temp_item_images_stittsville img
        ON img.item_id = i.id

      ORDER BY c.sort_order
    `);

    const categories = {};

    rows.forEach(row => {

      if (!categories[row.category_id]) {
        categories[row.category_id] = {
          id: row.category_id,
          name: row.category_name,
          items: []
        };
      }

      categories[row.category_id].items.push({
        id: row.item_id,
        name: row.item_name,
        description: row.description,
        price: (row.price / 100).toFixed(2),
        image: row.image_url
      });

    });

    res.json(Object.values(categories));

  } catch (err) {

    console.error("Menu fetch error:", err);
    res.status(500).json({ error: "Failed to fetch menu" });

  }

});