import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// REGISTER USER //
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body; //extract data from body of request using object destructuring

        const salt = await bcrypt.genSalt(); // Generate a salt using bcrypt. A salt is a random value used as an additional input to a one-way function that hashes data. // The purpose of the salt is to defend against dictionary attacks and pre-computed rainbow table attacks.
        const passwordHash = await bcrypt.hash(password, salt); // Hash the password using bcrypt. The hash function takes the password and the generated salt as inputs. // The output is a securely hashed version of the password, which is suitable for storing in a database. // The generated hash is unique for each password due to the use of a unique salt.
        
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000), //.floor rounds it to nearest integer, .random generates number between 0 and 1
            impressions: Math.floor(Math.random() * 10000),
        });

        const savedUser = await newUser.save()
        res.status(201).json(savedUser); //The HTTP status code 201 specifically means "Created". It indicates that the request has been fulfilled, and a new resource has been created as a result of the request. This status code is typically used in response to POST requests when a new resource, such as a new user account or a new record, has been successfully created on the server.
        
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
}

// LOGIN USER //
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return (
                res.status(400).json({ message: "User does not exist"})
            )
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return (
                res.status(400).json({ message: "Invalid credentials." })
            )
        }

        const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET );

        delete user.password; //delete password from object before sending to frontendW
        res.status(200).json({ token, user })

    } catch (err) {
        res.status(500).json({ error: err.message})
    }
}