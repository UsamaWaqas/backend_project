import dotenv from "dotenv"

import connectDB from "./db/index.js"


dotenv.config({
    path: './.env'
})

connectDB()
// .then(()=>{
//     app.listen(process.env.PORT || 8000,()=>{
//         console.log(`server is running at : ${process.env.PORT}`)

//     })
// })
// .catch((error)=>{
//     console.log("MONGODB CONNECTION FAILED!!!",error);
// })

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from "express";

// const app = express();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("Error :: ", error);

//       app.listen(process.env.PORT, () => {
//         console.log(`app is listening at ${process.env.PORT}`);
//       });
//     });
//   } catch (error) {
//     console.log("Error ::", error);
//     throw error;
//   }
// })();
