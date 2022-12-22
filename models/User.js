import mongoose from "mongoose"
import validator from "validator"
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        required:[true, 'Please enter name'],
        minlength: 3,
        maxlength: 20,
        trim: true,
        },
    email: {
        type: String, 
        required:[true, 'Please enter emal'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email'
        },
        unique: true,
        trim: true,
        },
    password: {
        type: String, 
        required:[true, 'Please enter password'],
        minlength: 6,
        maxlength: 20,
        trim: true,
        select: false,
        },
    lastName: {
        type: String, 
        maxlength: 20,
        trim: true,
        default: 'Last Name'
        },
    location: {
        type: String, 
        maxlength: 20,
        trim: true,
        default: 'My City'
        },
})

//Hash the password prior to it being saved
UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function() {
    return jwt.sign({userId: this._id}, 
                    process.env.JWT_SECRET, 
                    {expiresIn: process.env.JWT_LIFETIME}
)}

export default mongoose.model('User', UserSchema)