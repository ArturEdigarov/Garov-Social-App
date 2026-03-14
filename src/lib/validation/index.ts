import { z } from "zod"

export const SignupValidation = z.object({
    name: z.string().min(2, {message: 'Name should be at least 2 characters long'}),
    username: z.string().min(2).max(50),
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(8, {message: 'Password should be at least 8 characters long'}),
});
export const SigninValidation = z.object({
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(8, {message: 'Password should be at least 8 characters long'}),
});

export const PostValidation = z.object({
    caption: z.string().min(5).max(2200),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100),
    tags: z.string()
});
export const ProfileValidation = z.object({
    file: z.custom<File[]>(),
    name: z.string().min(2, { message: "Name should be at least 2 characters long" }),
    username: z.string().min(2, { message: "Username should be at least 2 characters long" }),
    bio: z.string().max(2200, { message: "Maximum 2200 characters long" }),
});