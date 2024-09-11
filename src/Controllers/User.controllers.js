import { application } from "express";
import { asyncHandler } from "../Utils/asyncHandler.js"
import {ApiError} from '../Utils/ApiError.js'
import {User} from '../Models/User.Models.js'
import {uploadOnCloudinary}  from '../Utils/cloudinary.js'
import { ApiResponse } from "../Utils/ApiResponse.js";




const generateAccessAndRefereshTokens = async(userId) =>{
  try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}


  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }

}



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
      // const coverImageLocalPath = req.files?.coverImage[0]?.path;
      let coverImageLocalPath;
      if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
          coverImageLocalPath = req.files.coverImage[0].path
      }
      

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

const loginUser = asyncHandler( async (req,res)=>{
      const {username,email,Password} = body.req;

      if((username && email)){
        throw new ApiError(401,"email and userName is required")
      }

      const user  = User.findOne(
        {
          $or : [{username},{email}]
        }

      )
      if(!user){
        throw new ApiError(404, "User does not exist")
      }

    const isPasswordvalid = await user.isPasswordCorrect(Password)

    if (!isPasswordvalid) {
      throw new ApiError(401, "Invalid user credentials")
      }
  
  const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
}


return res
.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(
    new ApiResponse(
        200, 
        {
            user: loggedInUser, accessToken, refreshToken
        },
        "User logged In Successfully"
    )
)


})

export {RegisterUser}