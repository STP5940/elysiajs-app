// controllers/user.controller.js

import Users from "../models/users.js";

const usersModel = new Users();

export const getUsers = async ({ set, profile }) => {
    try {
        // console.log('userId:', profile?.userId);
        const users = await usersModel.getAll();

        if (!users) {
            set.status = 404;
            return { status: "error", message: "User not found" };
        }

        set.status = 200;
        return {
            status: "success",
            message: "Users retrieved successfully",
            data: users
        };
    } catch (e) {
        console.error(e.message);

        set.status = 500;
        return { status: "error", message: "Internal server error" };
        // throw new Error('Internal server error while fetching users');
    }
}

export const getUserById = async ({ params, set }) => {
    try {
        const { id } = params;

        const user = await usersModel.getById(Number(id));

        if (!user) {
            set.status = 404;
            return { status: "error", message: "User not found" };
        }

        set.status = 200;
        return { 
            status: "success", 
            message: "User retrieved successfully",
            data: user 
        };
    } catch (e) {
        console.error(e.message);

        set.status = 500;
        return { status: "error", message: "Internal server error" };
    }
}

export const createUser = async ({ body, set }) => {
    try {
        const { name, email, password } = body;

        // ตรวจสอบว่า name และ email มีค่าหรือไม่
        if (!name || !email) {
            set.status = 422;
            return { status: "error", message: "Required fields: name and email" };
        }

        // Check if user exists
        const existingUser = await usersModel.getByEmail(email);

        if (!existingUser) {
            set.status = 409;
            return { status: "error", message: "Email already exists" };
        }

        const user = await usersModel.create(name, email, password);

        set.status = 200;
        return { 
            status: "success", 
            message: "User created successfully",
            data: user 
        };
    } catch (e) {
        console.error(e.message);

        set.status = 500;
        return { status: "error", message: "Internal server error" };
    }
}

export const updateUser = async ({ params, body, set }) => {
    try {
        const { id } = params;
        const { name, email } = body;

        // Check if user exists
        const existingUser = await usersModel.getById(Number(id));

        if (!existingUser) {
            set.status = 404;
            return { status: "error", message: "User not found" };
        }

        // ตรวจสอบว่า name และ email มีค่าหรือไม่
        if (!name || !email) {
            set.status = 422;
            return { status: "error", message: "Required fields: name and email" };
        }

        const updatedUser = await usersModel.update(Number(id), name, email);

        set.status = 200;
        return { 
            status: "success", 
            message: "User updated successfully",
            data: updatedUser 
        };
    } catch (e) {
        console.error(e.message);

        set.status = 500;
        return { status: "error", message: "Internal server error" };
    }
}

export const deleteUser = async ({ params, set }) => {
    try {
        const { id } = params;

        // Check if user exists
        const existingUser = await usersModel.getById(Number(id));

        if (!existingUser) {
            set.status = 404;
            return { status: "error", message: "User not found" };
        }

        await usersModel.delete(Number(id));

        set.status = 200;
        return { status: "success", message: "User deleted" };
    } catch (e) {
        console.error(e.message);

        set.status = 500;
        return { status: "error", message: "Internal server error" };
    }
}