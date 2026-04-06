import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { findUserByEmail, createUser, findUserById, updateUser } from "./auth.repository";
import { AppError } from "../errors/AppError";
import { User } from "../generated/prisma";

const JWT_SECRET = process.env.JWT_SECRET

export type SafeUser = Omit<User, "password">;

export async function getMe(userId: number): Promise<SafeUser> {
    const user = await findUserById(userId);
    if (!user) {
        throw new AppError(404, "User not found");
    }
    const { password: _, ...safeUser } = user;
    return safeUser;
}

export async function registerUser(name: string, email: string, password: string) {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new AppError(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password,10);
    const user = await createUser(name, email, hashedPassword);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
}

export async function loginUser(email: string, password: string) {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new AppError(401, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError(401, "Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
}

export async function updateProfile(userId: number, data: { name?: string; email?: string; password?: string; avatar?: string }) {
    const user = await getMe(userId); // This will throw if user doesn't exist
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    const updatedUser = await updateUser(userId, data);
    const { password: _, ...safeUser } = updatedUser;
    return safeUser;
}