import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import jwt  from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { name ,email, password } = req?.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    return res.status(400).json({ message: "User already exist" });
  }
  const hash = await bcrypt.hash(password, 10);
  const newUser = { name, email, password: hash };
  const { password: _, ...safeUser } = newUser;
  await prisma.user.create({ data: newUser });
  return res
    .status(201)
    .json({ message: "User created successfully", user: safeUser });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req?.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: "User not exist" });
  }
  const isValidPass = await bcrypt.compare(password, user?.password);
  if(!isValidPass){
    return res.status(400).json({message: "Invalid credentials"})
  }
  const token = jwt.sign(
    {email},
    process?.env?.JWT_SECRET || "SECRET",
    {expiresIn: "1d"}
  )
  return res.status(200).json({token})
};
