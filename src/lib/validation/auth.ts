import { z } from "zod";
import { fileSchema } from "./file";

const passwordRegex = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
export const isEmpty = (value: string) => value.trim().length > 0;

export const registerSchema = z.object({
  fullname: z
    .string()
    .refine((value) => isEmpty(value), "اسم و فامیل نمیتواند خالی باشد"),
  username: z
    .string()
    .refine((value) => isEmpty(value), "نام کاربری نمیتواند خالی باشد"),
  position: z.string().refine((value) => value !== "-1", "شغلی انتخاب نکردی"),
  password: z.string().regex(passwordRegex, "فرمت پسورد غلطه"),
  image: fileSchema,
});

export const loginSchema = registerSchema.pick({
  username: true,
  password: true,
});

export const updateUserSchema = z.object({
  username: z
    .string()
    .refine((value) => isEmpty(value), "نام کاربری نمیتواند خالی باشد"),
  image: z
    .instanceof(File)
    .transform((file) => (file.size > 0 ? file : undefined))
    .superRefine((file, ctx) => {
      if (!file) return;

      const result = fileSchema.safeParse(file);
      if (!result.success) {
        if (!result.success) {
          for (const issue of result.error.issues) {
            ctx.addIssue(issue);
          }
        }
      }
    }),
});

export const newPasswordSchema = z.object({
  newPassword: loginSchema.shape.password,
  currentPassword: loginSchema.shape.password,
});
