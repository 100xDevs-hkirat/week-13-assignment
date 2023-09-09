import { z } from "zod";
// const z = require('zod');
export const userTypes = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const adminTypes = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const courseTypes = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number(),
  imageLink: z.string().min(1),
  published: z.boolean(),
});

export type userParams = z.infer<typeof userTypes>;
export type adminParams = z.infer<typeof adminTypes>;
export type courseTypes = z.infer<typeof courseTypes>;
