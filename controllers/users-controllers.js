const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.pid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    // console.log(err)
    const error = new HttpError(
      'Something went wrong, could not find a user.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      'Could not find a user for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ user: user.toObject({ getters: true }) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, last_name, email, tel, date_birth, password, role, origin, alias, country, state, city, suburb, postal_code, address, interior_num } = req.body;

  let image=''
  if (req.body.imageUrl) {
    image = req.body.imageUrl;
  } else if (req.file) {
    if (req.file.path) {
     image = req.file.path;
    }
  }

  let existingUser
  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    console.log(error);
    return next(error);
  }

  let hashPassword;
  try {
    hashPassword = await bcrypt.hash(password, 12);
  } catch {
    const error = new HttpError(
      'Could not create user, please try again.',
      422
    );
    console.log(error);
    return next(error);
  }

  const createdUser = new User({
    name, last_name, email, tel, date_birth, password: hashPassword, image, role, origin, alias, country, state, city, suburb, postal_code, address, interior_num, image: image
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    console.log(error);
    return next(error);
  }

  let token
  try {
    token = jwt.sign({ userId: createdUser.id }, "palcosplusencrypttokenkey", { expiresIn: '4h' })
  } catch {
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    console.log(error);
    return next(error);
  }

  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  console.log('entra al login')
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    console.log(error);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    console.log(error);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password)
  } catch {
    const error = new HttpError(
      'Invalid credentials, could not log you in. Please check your credentials',
      401
    );
    console.log(error);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid pasword, could not log you in.',
      401
    );
    console.log(error);
    return next(error);
  }

  let token
  try {
    token = jwt.sign({ userId: existingUser.id }, "palcosplusencrypttokenkey", { expiresIn: '2h' })
  } catch {
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    console.log(error);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token
  });
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, last_name, new_email, email, tel, date_birth, password, role, origin, alias, country, state, city, suburb, postal_code, address, interior_num } = req.body;

  let image
  if (req.body.imageUrl) {
    image = req.body.imageUrl;
  } else if (req.file) {
    if (req.file.path) {
     image = req.file.path;
    }
  }

  let existingUser
  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    console.log(error);
    return next(error);
  }

  if(existingUser){
    existingUser.name = name;
    existingUser.last_name=last_name;
    existingUser.email=new_email;
    existingUser.tel=tel;
    existingUser.date_birth=date_birth;
    existingUser.alias=alias;
    existingUser.country=country;
    existingUser.state=state;
    existingUser.city=city;
    existingUser.suburb=suburb;
    existingUser.postal_code=postal_code;
    existingUser.address=address;
    existingUser.interior_num=interior_num;
    if(image){
      existingUser.image=image;
    }
  }else{
    const error = new HttpError(
      'Could not find a user for the email.',
      404
    );
    return next(error);
  }

  try {
    await existingUser.save();
  } catch (err) {
    console.log('error')
    const error = new HttpError(
      'Something went wrong, could not update the user.',
      500
    );
    console.log(error);
    return next(error);
  }

  let token
  try {
    token = jwt.sign({ userId: existingUser.id }, "palcosplusencrypttokenkey", { expiresIn: '2h' })
  } catch {
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    console.log(error);
    return next(error);
  }

  res.status(201).json({ userId: existingUser.id, email: existingUser.email, token: token });
};

exports.getUserById = getUserById;
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.updateUser = updateUser;
