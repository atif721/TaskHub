import { Logger } from "@packages/logger";
import { Request, Response } from "express";
import User from '../models/user';
import bcrypt from 'bcrypt';

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email address already in use"
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashPassword,
      name
    });

    return res.status(201).json(
      { message: "Verification email sent to your email. Please check inbox and verify account" }
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      Logger.error(err.message);
    } else {
      Logger.error(String(err));
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginUser = async (req: Request, res: Response) => {

};

export { registerUser, loginUser };
