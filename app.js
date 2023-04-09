require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const { name } = require("ejs");


const app = express();
app.set('view engine', 'ejs'); // using ejs first time.
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")) // to tell express use resources from public folder, becuase it ignores other folders like css, images etc.

// connecting MongoDB using mongoose through MongoDB atlas
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.DATABASE);
    console.log("Database Connected Succefully!");
}

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);
// adding item that we had on array previously.
const item = new Item({
    name: "Buy Food"
});

const item2 = new Item({
    name: "Cook Food"
});

const item3 = new Item({
    name: "Eat Food"
});

// item.save(); 
// item2.save();
// item3.save();

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.get("/", function (req,res) {
    // logging all the items from database
    async function displayItems() {
        const items = await Item.find({});
        // console.log(items);
        res.render("lists", { listTitle: "Today", newListItems: items });
    }
    displayItems();
    // res.render("lists", { listTitle: "Today", newListItems: items});
})

app.post("/", function (req,res) {
    // console.log(req.body.button);
    // currently ignoring work list
    // let item = req.body.newItem;
    // if (req.body.button==="Work List"){
    //     workItems.push(item);
    //     res.redirect("/work")
    // }else{
    //     items.push(item);
    //     res.redirect("/");
    // }

    const itemName = req.body.newItem;
    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/");
})

app.post("/delete", function(req,res) {
// console.log(req.body.checkbox); prints the id of checked box, which we want to delete when user checked it
    const checkedItemId = req.body.checkbox;
    async function deleteItem(id) {
        const res = await Item.deleteOne({ _id: id }); 
        console.log(res);
    }
    deleteItem(checkedItemId);
    res.redirect("/");
});

app.get("/about", function (req,res) {
    res.render("about");
})

app.listen("3000", function () {
    console.log("Server is running at 3000");
})