// controllers/user.controller.js

import Users from "../models/users.js";

const usersModel = new Users();

export const getUsers = async ({ set, profile }) => {
    try {
        // console.log('userId:', profile?.userId);
        const users = await usersModel.getAll();

        if (!users) {
            set.status = 404;
            return { status: "error", response: "User not found" };
        }

        set.status = 200;
        return { status: "success", response: users };
    } catch (e) {
        console.error(e.message);

        set.status = 500;
        return { status: "error", response: "Internal Server Error" };
    }
}

export const getUserById = async ({ params, set }) => {
    try {
        const { id } = params;

        const user = await usersModel.getById(Number(id));

        if (!user) {
            set.status = 404;
            return { status: "error", response: "User not found" };
        }

        set.status = 200;
        return { status: "success", response: user };
    } catch (e) {
        console.error(e.message);

        set.status = 500;
        return { status: "error", response: "Internal Server Error" };
    }
}

export const createUser = async ({ body, set }) => {
    try {
        const { name, email, password } = body;

        // ตรวจสอบว่า name และ email มีค่าหรือไม่
        if (!name || !email) {
            set.status = 422;
            return { status: "error", response: "Required fields: name and email" };
        }

        // Check if user exists
        const existingUser = await usersModel.getByEmail(email);

        if (existingUser) {
            set.status = 409;
            return { status: "error", response: "Email already exists" };
        }

        const user = await usersModel.create(name, email, password);

        set.status = 200;
        return { status: "success", response: user };
    } catch (e) {
        console.error(e.message);

        set.status = 500;
        return { status: "error", response: "Internal Server Error" };
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
            return { status: "error", response: "User not found" };
        }

        // ตรวจสอบว่า name และ email มีค่าหรือไม่
        if (!name || !email) {
            set.status = 422;
            return { status: "error", response: "Required fields: name and email" };
        }

        const updatedUser = await usersModel.update(Number(id), name, email);

        set.status = 200;
        return { status: "success", response: updatedUser };
    } catch (e) {
        console.error(e.message);

        set.status = 500;
        return { status: "error", response: "Internal Server Error" };
    }
}

export const deleteUser = async ({ params, set }) => {
    try {
        const { id } = params;

        // Check if user exists
        const existingUser = await usersModel.getById(Number(id));

        if (!existingUser) {
            set.status = 404;
            return { status: "error", response: "User not found" };
        }

        await usersModel.delete(Number(id));

        set.status = 200;
        return { status: "success", response: "User deleted" };
    } catch (e) {
        console.error(e.message);

        set.status = 500;
        return { status: "error", response: "Internal Server Error" };
    }
}