import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = 3000;

app.get("/menu", async (req, res) => {

    try{

        const response = await fetch(
        "https://www.clover.com/oloservice/v1/merchants/P62BGGNV7NPE1/menu?orderType=PICKUP"
        );

        const data = await response.json();

        res.json(data);

    }catch(err){
        res.status(500).json({error:"Failed to fetch menu"});
    }

});

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});