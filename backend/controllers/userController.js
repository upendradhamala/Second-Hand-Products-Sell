import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  console.log(await user.matchPassword(password))

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      address: user.address,
      contact: user.contact,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

//GET USER PROFILE
const getUserProfile = asyncHandler(async (req, res) => {
  //here req.user is coming from middleware
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      address: user.address,
      contact: user.contact,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

//register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, contact, address } = req.body
  const { phone_no } = contact
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }
  const validatePassword = password.length

  if (validatePassword <= 6) {
    res.status(400)
    throw new Error('Password length must be greater than 6')
  }

  const validateContact = contact.phone_no.length
  console.log(validateContact)
  if (validateContact !== 10) {
    res.status(400)
    throw new Error('Enter 10 digit mobile number')
  }
  const user = await User.create({
    name,
    email,
    password,
    contact,
    address,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      address: user.address,
      contact: user.contact,
    })
  } else {
    res.status(400)
    throw new Error('Invalid User Data')
  }
})
export { authUser, getUserProfile, registerUser }