// models/user.js

import { prisma } from './prisma.js';

class Users {
    async getAll() {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                password: false,
            }
        });
        return users;
    }

    async getById(_id) {
        const user = await prisma.users.findUnique({
            select: {
                id: true,
                name: true,
                email: true,
                password: false,
            },
            where: {
                id: Number(_id)
            },
        });
        return user;
    }

    async getByEmail(_email) {
        const user = await prisma.users.findUnique({
            where: {
                email: _email
            },
        });
        return user;
    }

    async create(_name, _email, _password) {

        // เข้ารหัสรหัสผ่านก่อนบันทึก
        const hashedPassword = await Bun.password.hash(_password);
        const user = await prisma.users.create({
            select: {
                id: true,
                name: true,
                email: true,
                password: false,
            },
            data: {
                name: _name,
                email: _email,
                password: hashedPassword,
            }
        });
        return user;
    }

    async update(_id, _name, _email) {
        const user = await prisma.users.update({
            select: {
                id: true,
                name: true,
                email: true,
                password: false,
            },
            where: {
                id: Number(_id)
            },
            data: {
                name: _name,
                email: _email
            }
        });
        return user;
    }

    async delete(_id) {
        const user = await prisma.users.delete({
            where: {
                id: Number(_id)
            }
        });
        return user;
    }
}

export default Users;