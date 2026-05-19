import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req?.body;

  // check if email already exists before creating — avoid duplicate accounts
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    return res.status(400).json({ message: "User already exist" });
  }

  // never store plain text passwords — hash with 10 salt rounds (industry standard)
  const hash = await bcrypt.hash(password, 10);
  const newUser = { name, email, password: hash };

  // strip password from response — client should never receive it even hashed
  const { password: _, ...safeUser } = newUser;
  await prisma.user.create({ data: newUser });

  return res
    .status(201)
    .json({ message: "User created successfully", user: safeUser });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req?.body;

  // find user by email — if not found, don't reveal whether email exists or not
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: "User not exist" });
  }

  // bcrypt re-hashes the incoming password and compares — never decrypts
  const isValidPass = await bcrypt.compare(password, user?.password);
  if (!isValidPass) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // sign token with user id and email — never include password in payload
  // token expires in 1 day so stolen tokens don't last forever
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process?.env?.JWT_SECRET || "SECRET",
    { expiresIn: "1d" },
  );

  return res.status(200).json({ token });
};

export const verify = async (req: Request, res: Response) => {
  // token comes in Authorization header as "Bearer <token>"
  const auth = req?.headers?.authorization;
  if (!auth) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // split "Bearer <token>" and take index 1 to get just the token
  const token = auth.split(" ")[1];
  try {
    // jwt.verify throws if token is expired or signature doesn't match
    const decoded = jwt.verify(token, process?.env?.JWT_SECRET || "SECRET");
    return res.status(200).json({ message: "Authorized", user: decoded });
  } catch (err) {
    // any verification failure returns 401 — don't expose why it failed
    return res.status(401).json({ message: "Unauthorized" });
  }
};