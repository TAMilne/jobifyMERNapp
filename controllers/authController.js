import User from "../models/User.js"
import {StatusCodes} from 'http-status-codes'
import {BadRequestError} from "../errors/index.js"

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        throw new BadRequestError('please provide all values');
    }

    const UserAlreadyExists = await User.findOne({ email });
    if(UserAlreadyExists) {
        throw new BadRequestError('That email is already registered');
    }

    const user = await User.create({name, email, password});
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{email: user.email, 
                                            lastName: user.lastName, 
                                            location: user.location, 
                                            firstName: user.name}, 
                                    token, 
                                    location: user.location});
}

const login = async (req, res) => {
    res.send('login user');
}

const updateUser = async (req, res) => {
    res.send('updateUser');
}

export {register, login, updateUser}
