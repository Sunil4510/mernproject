const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Employregister",{
    useCreateIndex:true,
    useFindAndModify:false,
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log("Connected to DataBase ")
})
.catch(()=>{
    console.log("Failed!");
});