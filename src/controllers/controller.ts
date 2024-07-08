import {Request, Response} from "express";
import {db} from "../db";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";
import { CustomRequest } from "../utils/types";
import { generateToken } from "../utils/token";


export const signUp = async (req:Request, res: Response) => {
   try {

    const {firstName, lastName,  email, password, phone} = req.body;
    console.log(req.body);

    if(!firstName){
        return res.status(402).json({message:"fisrtName required"});
    }

    if(!lastName){
        return res.status(402).json({message: "lastName required"});
    }

    if(!email){
        return res.status(402).json({message:"email required"});
    }

    if(!password){
        return res.status(402).json({message:"password required"});
    }

    const userExists = await db.user.findUnique({
        where: {
            email
        }
    });

    if(userExists){
        return res.status(409).json({message:"User already exists"});
    }
    
    const hash = await bcrypt.hash(password, 10);
     
     const token = jwt.sign({email}, process.env.SECRET!, {expiresIn: "1h"});

   const user =  await db.user.create({
        data: {
            firstName,
            lastName,
            email,
            password:hash,
            phone: phone || "",
            organisations:{
                create: {
                    name: `${firstName}'s Organisation`
                }
            }
        },
        select: {
            userId: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          
        }
        
    })
  

    res.status(201).json({
            status: "success",
            message:"Registration successful",
            data: {
                accessToken: token,
                user
            }
    });

    
   } catch (error) {
        res.status(400).json({
            status: "Bad request",
            message: "Registration unsuccessful",
            statusCode: 400
        });
   }
    
} 

export const signIn = async (req:Request, res: Response) => {
    try {
        
        const {email, password} = req.body;

    if(!email){
        return res.status(402).json({message:"email required"});
    }

    if(!password){
        return res.status(402).json({message:"password required"});
    }

    const user = await db.user.findUnique({
        where: {
            email
        }
    });

    if(!user){
        return res.status(404).json({message:"User not found"});
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword){
        return res.status(401).json({
            status: "Bad request",
            message: "Authentication failed",
            statusCode: 401
        });
    }

    const token = generateToken({userId: user.userId, email: user.email});

    res
    .cookie("access_token", token)
    .status(200).json({
        status: "success",
        message: "Login successful",
        data: {
            accessToken: token,
            user
        }
    })

    } catch (error) {
        res.status(500).json({message: "Internal server error"});    
    }   
}


export const getRecords = async (req:CustomRequest, res:Response) => {

    const {id} = req.params;
    const user = await db.user.findUnique({
        where: {
            userId: id
        }
    });    

    if(!user){
        return res.status(404).json({message:"User not found"});
    }

    res.status(200).json({
        status: "success",
        message:"User found",
        data: {
            user
        }
    })
}

export const getOrganisations = async (req:CustomRequest, res:Response) => {
    try {
        const user = await db.user.findUnique({
            where: {
                userId: req.verifiedUser.userId
            }
        });
    
        if(!user){
            return res.status(400).json({status:"bad Request",message:"User not found"});
        }
        
        const organisations = await db.organisation.findMany({
            where:{
                users:{
                    some:{
                        userId:user.userId
                    }
                }
            }
        });
    
    
        res.status(200).json({
            status: "success",
            message:"Organisations found",
            data: organisations
    
        })
    } catch (error) {
        res.status(400).json({
            status: "Bad Request",
            message: "Client error",
            statusCode: 400
        }) 
       
    }
}

export const getOrganisation = async (req:CustomRequest, res:Response) => { 
      try {
        const {orgId} = req.params;
        const user = await db.user.findUnique({
             where: {
                   userId: req.verifiedUser.userId
             }
        });
       
        if(!user){
             return res.status(404).json({message:"User not found"});
        }
       
        const organisation = await db.organisation.findUnique({
             where: {
                   orgId
             },
             select:{
                name: true,
                description: true,
                orgId: true,
             }
        });
       
        if(!organisation){
             return res.status(404).json({message:"Organisation not found"});
        }
       
        res.status(200).json({
             status: "success",
             message:"Organisation found",
             data: organisation
        })    
      } catch (error) {
        res.status(400).json({
            status: "Bad Request",
            message: "Client error",
            statusCode: 400
        }) 
      }
    
     
    
} 

export const createOrganisation = async (req:CustomRequest, res:Response) => { 
  
    try {
    const {name, description} = req.body;

    if(!name){
        return res.status(402).json({message:"name required"});
    }

    const user = await db.user.findUnique({
        where: {
            userId: req.verifiedUser.userId
        }
    });

    if(!user){
        return res.status(404).json({message:"User not found"});
    }

    const organisation = await db.organisation.create({
        data: {
            name,
            description: description || "",
            users: {
                connect: {
                    userId: user.userId
                }
            }
        }
    });

    res.status(201).json({
        status: "success",
        message:"Organisation created successfully",
        data: organisation
    })
    
  } catch (error) {
         res.status(400).json({
            status: "Bad Request",
            message: "Client error",
            statusCode: 400
        });   
  }
    
}

export const addUserToOrganisation = async (req:CustomRequest, res:Response) => {

    try {
        const {orgId} = req.params;
        const {userId} = req.body;
        
        if(!userId){
            return res.status(402).json({message:"userId required"});
        }

        const user = await db.user.findUnique({
            where: {
                userId: req.verifiedUser.userId
            }
        });

        if(!user){
            return res.status(404).json({message:"Unauthorised"});
        }

        const organisation = await db.organisation.findUnique({
            where: {
                orgId
            }
        });

        if(!organisation){
            return res.status(404).json({message:"Organisation not found"});
        }

        const userToAdd = await db.user.findUnique({
            where: {
                 userId
            }
        });

        if(!userToAdd){
            return res.status(404).json({message:"User to add not found"});
        }

        const userExists = await db.organisation.findFirst({
            where: {
                orgId,
                users: {
                    some: {
                        userId: userToAdd.userId
                    }
                }
            }
        });

        if(userExists){
            return res.status(409).json({message:"User already in organisation"});
        }

        const updatedOrganisation = await db.organisation.update({
            where: {
                orgId
            },
            data: {
                users: {
                    connect: {
                        userId: userToAdd.userId
                    }
                }
            }
        });

        res.status(200).json({
            status: "success",
            message:"User added to organisation successfully",
        });

    } catch (error) {
        res.status(400).json({
            status: "Bad Request",
            message: "Client error",
            statusCode: 400
        });
    }
}