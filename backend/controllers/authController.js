import User from '../models/Users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Signup User
export const signupUser = async (req, res ) =>{
    try{
        const { name, email, password } = req.body;

        //Check if user is already exist or not 
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({ message: " User already exists "});
        }
        //HashPassword
        const hashPassword = await bcrypt.hash(password, 10);

        //create user
        const user = await User.create({
            name,
            email,
            password: hashPassword
        })

        res.json({ 
            message: " User Registered Successfull ",
            userId: user._id
        });
    }catch(error){
        res.status(500).json({ message: " server error ", error});
    }
}

//Login User
export const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        //check if user exists or not
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: " User not found "});
        }

        //compare password
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(400).json({ message: " Invalid credentials "});
        }

        //Generate JWT Token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({
             message: " Login successful ",
              token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email   
            }
         });

    }catch(error){
        res.status(500).json({ message: " server error ", error});
    }
}