const express = require("express");
const cors = require("cors");
const users = require("./Users.json");
const fs=require("fs");
const app = express();
app.use(express.json())
const port = 8000;
app.use(cors({
    origin: "http://localhost:3000",
    methods:["GET","PATCH","DELETE","POST"]
}));

app.get("/users", (req, res) => {
    return res.json(users);
});
app.post("/users",(req,res)=>
{
       let {name,age,email,phone}=req.body;
       let id=Date.now();
       users.push({id:id,name,age,email,phone});
       fs.writeFile("./Users.json",JSON.stringify(users),(err,data)=>
        {
            return res.json({message:"data added successfully"});
        })
     
})
app.patch("/users",(req,res)=>{
    let {name,age,email,phone}=req.body;
    let index=users.findIndex((user)=>user.phone==phone);
    let id=users[index].id;
    users.splice(index,1,{id,name,age,email,phone});
    fs.writeFile("./Users.json",JSON.stringify(users),(err,data)=>{
        return res.json({message:"data updated successfully"});
    })
})
app.delete("/users/:id",(req,res)=>
{
      let id=Number(req.params.id);
      let filtered=users.filter((user)=> user.id!==id);
      users.length=0;
      users.push(...filtered);
      fs.writeFile("./Users.json",JSON.stringify(filtered),(err,data)=>
    {
        return res.json(filtered);
    })

})

app.listen(port, (err) => {
    if (err) {
        console.error("Error starting the server:", err);
    } else {
        console.log(`The app is running on port ${port}`);
    }
});
