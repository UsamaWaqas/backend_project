import { application } from "express";
import { asyncHandler } from "../Utils/asyncHandler.js"
import {ApiError} from '../Utils/ApiError.js'
import {User} from '../Models/User.Models.js'
import {uploadOnCloudinary}  from '../Utils/cloudinary.js'
import { ApiResponse } from "../Utils/ApiResponse.js";

const RegisterUser = asyncHandler(async (req,res)=>{
    console.log(res)
     

  const  {username,email,fullName,Password} = req.body|| {};

//  console.log("email:", email)
      if([fullName,username,email,Password].some((field)=> field?.trim()=== "")
      )
      {
        throw new ApiError(400,"all fields are required")
      }

   const existUser   =  await User.findOne({
        $or : [{email},{username}]
      })
      if(existUser){
        throw new ApiError(409,"user with this email and username is already exit")
      }

      const avatarLocalPath = req.files?.avatar[0]?.path;
      const coverImageLocalPath = req.files?.coverImage[0]?.path;

      if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
      throw new ApiError(400, "avatar file is required")
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email, 
    Password,
    username: username.toLowerCase()
})

const createdUser = await User.findById(user._id).select(
  "-Password -refreshToken"
)
if (!createdUser) {
  throw new ApiError(500, "Something went wrong while registering the user")
}

return res.status(201).json(
  new ApiResponse(200, createdUser, "User registered Successfully")
)

})

export {RegisterUser}