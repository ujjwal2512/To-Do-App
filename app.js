const express=require("express");
const bodyParser=require("body-parser");
//const date=require(__dirname+"/date.js");
const mongoose=require("mongoose");
const _ =require("lodash");
const app=express();
app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});
//mongoose schema
const itemsSchema={
    name: String
};
//mongoose model
const Item=mongoose.model("Item",itemsSchema);

//mongoose document
const Item1=new Item({
   name: "Welcome to your To Do List!" 
});
const Item2=new Item({
    name: "Hit + button to add a new item." 
 });
 const Item3=new Item({
    name: "Hit <-- to delete an item." 
 });

 const defaultItems=[Item1,Item2,Item3];

 const listSchema={
    name:String,
    items:[itemsSchema]
 };
 const List=mongoose.model("List",listSchema);


// Item.insertMany(defaultItems,function(err){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("Successfully saved default items.");
//     }
// });


app.get("/",function(req,res){
    //let day=date();

    Item.find({}).then(function(FoundItems){
        if(FoundItems.length===0){
            Item.insertMany(defaultItems).then(function () {
                console.log("Successfully saved defult items to DB");
              }).catch(function (err) {
                console.log(err);
              });
              res.redirect("/");
            
        }else{
    
        res.render("list",{
            listTitle:"Today",
            Items:defaultItems
        });}
    
      })
       .catch(function(err){
        console.log(err);
      })
    

});

app.get("/:customListName",function(req,res){
const customListName=_.capitalize(req.params.customListName);
List.findOne({name:customListName}).then(function (foundList) {
    if(!foundList){
        const list=new List({
            name:customListName,
            items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
        
    }else{
        res.render("list",{listTitle:foundList.name,Items:foundList.items})
    }
  }).catch(function (err) {
    console.log(err);
  });


});

app.post("/",function(req,res){
    const itemName=req.body.newItem;
    const listName=req.body.list;


    const item=new Item({
        name:itemName
    });
if(listName==="Today"){
    item.save();
    res.redirect("/");
}else{
    List.findOne({name:listName}).then(function (foundList) {
       foundList.items.push(item);
       foundList.save();
       res.redirect("/"+listName);
      }).catch(function (err) {
        console.log(err);
      });
    
}

   
    
});

app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;
    const listName=req.body.listName;

    if(listName==="Today"){
        Item.findByIdAndRemove(checkedItemId).then(function () {
            console.log("Successfully deleted");
          }).catch(function (err) {
            console.log(err);
          });
          res.redirect("/"); 
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}}).then(function (foundList) {
            res.redirect("/"+listName);
          }).catch(function (err) {
            console.log(err);
          });
    }

   

});



app.post("/work",function(req,res){
    let worktem=req.body.newItem;
    workitems.push(workitem);

    res.redirect("/work");
});

app.listen(3000,function(){
    console.log("Server is running on port 3000");
});  