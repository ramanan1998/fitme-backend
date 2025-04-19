import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../model/user";

export const createUser = async (req: Request, res: Response) => {

    try{

        const { firstname, lastname, email, password } = req.body;

        const user = await userModel.findOne({ email });

        if(user){
            res.status(400).json("email already exists");
            return;
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const createNewUser = await userModel.create({
            firstname,
            lastname,
            email,
            password: hashPassword,
            isActive: true,
        });

        const token = jwt.sign(
            {
                userId: createNewUser.id, 
                firstname: createNewUser.firstname, 
                lastname: createNewUser.lastname, 
                email: createNewUser.email 
            },
            process.env.JWT_SECURITY_KEY as string,
            { expiresIn: "7d" }
        );

        res.status(200).json({ 
            userId: createNewUser.id,
            firstname: createNewUser.firstname, 
            lastname: createNewUser.lastname, 
            email: createNewUser.email,
            authToken:token
        });

    }catch(error){
        console.log(error);
        res.status(500).json({ message: "internal server error" })
    }
}

export const login = async (req: Request, res: Response) => {

    try{

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if(!user){
            res.status(400).json({ message: "email id does not exist" });
            return;
        }

        if(!user.isActive){
            res.status(400).json({ message: "your account is currently inactive" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            res.status(400).json({ message: "Incorrect password" });
            return;
        }

        const token = jwt.sign(
            { 
                userId: user.id, 
                firstname: user.firstname, 
                lastname: user.lastname, 
                email: user.email 
            },
            process.env.JWT_SECURITY_KEY as string,
            { expiresIn: "7d" }
        );

        res.status(200).json(
            { 
            userId: user.id,
            firstname: user.firstname, 
            lastname: user.lastname, 
            email: user.email,
            authToken:token
        });


    }catch(error){
        //console.log(error);

        res.status(500).json({ message: "internal server error" })
    }
}