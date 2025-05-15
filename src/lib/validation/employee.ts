import { z } from "zod";
import { isEmpty } from "./auth";

export const addImprestSchema = z.object({
  amount: z.coerce
    .number()
    .min(100_000, "حداقل مبلغ مساعده 100 هزارتومان میباشد"),
});

export const updateImprestSchema = z.object({
  status: z.enum(["ACCEPT", "REJECT"], { message: "یک مورد را انتخاب کنید" }),
  message: z
    .string()
    .refine((value) => isEmpty(value), "پیام نمیتواند خالی باشد"),
});

export const addVacationSchema = z.object({
  reason: z.string().optional(),
  requestDate: z
    .string()
    .refine((value) => isEmpty(value), "تاریخی رو انتخاب نکردین"),
});

export const updateVacationSchema = updateImprestSchema;
