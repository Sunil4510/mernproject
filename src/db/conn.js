const mongoose = require("mongoose");

mongoose.connect(`mongodb://${process.env.db_host}:${process.env.port_Number}/${process.env.db_name}`,{
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