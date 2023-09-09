"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseTypes = exports.adminTypes = exports.userTypes = void 0;
const zod_1 = require("zod");
// const z = require('zod');
exports.userTypes = zod_1.z.object({
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(1),
});
exports.adminTypes = zod_1.z.object({
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(1),
});
exports.courseTypes = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    price: zod_1.z.number(),
    imageLink: zod_1.z.string().min(1),
    published: zod_1.z.boolean(),
});
