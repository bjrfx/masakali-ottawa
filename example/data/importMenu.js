const mysql = require("mysql2/promise");
const fs = require("fs");

async function run(){

try{

const connection = await mysql.createConnection({
    host:"sv63.ifastnet12.org",
    user:"masakali_kiran",
    password:"K143iran",
    database:"masakali_california",
    port:3306
});

console.log("Connected to MySQL");

/* LOAD JSON FILE */

const data = JSON.parse(
    fs.readFileSync("./menudata.json","utf8")
);

const categories = data.categories;
const items = data.items;

/* CLEAN TEMP TABLES */

await connection.execute("SET FOREIGN_KEY_CHECKS=0");

await connection.execute("TRUNCATE temp_category_items_stittsville");
await connection.execute("TRUNCATE temp_item_images_stittsville");
await connection.execute("TRUNCATE temp_items_stittsville");
await connection.execute("TRUNCATE temp_categories_stittsville");

await connection.execute("SET FOREIGN_KEY_CHECKS=1");

/* INSERT CATEGORIES */

for(const key in categories){

    const cat = categories[key];

    await connection.execute(
        "INSERT INTO temp_categories_stittsville (id,name,sort_order) VALUES (?,?,?)",
        [
            cat.id,
            cat.name,
            cat.sortOrder
        ]
    );

}

console.log("Categories inserted");

/* INSERT ITEMS */

for(const item of items){

    await connection.execute(
        "INSERT INTO temp_items_stittsville (id,name,description,price,available,age_restricted) VALUES (?,?,?,?,?,?)",
        [
            item.id,
            item.name,
            item.description,
            item.price,
            item.available,
            item.isAgeRestricted
        ]
    );

    /* INSERT ITEM IMAGES */

    if(item.images){

        for(const img of item.images){

            await connection.execute(
                "INSERT INTO temp_item_images_stittsville (item_id,image_type,image_url) VALUES (?,?,?)",
                [
                    item.id,
                    img.name,
                    img.source
                ]
            );

        }

    }

}

console.log("Items inserted");

/* INSERT CATEGORY → ITEM RELATION */

for(const key in categories){

    const cat = categories[key];

    if(cat.items){

        for(const itemId of cat.items){

            await connection.execute(
                "INSERT INTO temp_category_items_stittsville (category_id,item_id) VALUES (?,?)",
                [
                    cat.id,
                    itemId
                ]
            );

        }

    }

}

console.log("Category relations inserted");

console.log("Menu import completed successfully");

connection.end();

}catch(err){

console.error("Error importing menu:",err);

}

}

run();