"use client";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "./Button";
import Textarea from "./Textarea";
import DatePicker from "./DatePicker";

import { addVacation } from "@/actions/employees";
import { toastCallback } from "@/util/toast";
import { toast } from "react-toastify";

type AddVacationFormProps = {
  userId: string;
};

export default function AddVacationForm({ userId }: AddVacationFormProps) {
  const { push } = useRouter();
  const [vacationDate, setVacationDate] = useState<undefined | number>();

  const [state, action, pending] = useActionState(
    toastCallback(
      async (_: unknown, formData: FormData) =>
        addVacation(_, formData, userId),
      {
        onError(result) {
          toast.error(result.message);
        },
        onSuccess(result) {
          toast.success(result.message, {
            onClose: () => {
              push("/p-employee/vacations");
            },
          });
        },
      }
    ),
    undefined
  );

  console.log(vacationDate);

  const actionHandler = (formData: FormData) => {
    formData.append("requestDate", vacationDate ? String(vacationDate) : "");
    action(formData);
  };

  return (
    <form action={actionHandler} className="space-y-3">
      <div className="space-y-2.5">
        <label>تاریخ مرخصی</label>
        <DatePicker
          value={vacationDate}
          onChange={(newDate) => setVacationDate(newDate)}
        />

        {state?.errors?.requestDate && (
          <p className="font-bold text-red-600 text-sm">
            {state?.errors?.requestDate[0]}
          </p>
        )}
      </div>

      <Textarea
        rows={5}
        name="reason"
        id="reason"
        label="دلیل مرخصی (اختیاری)"
        defaultValue={state?.inputs?.reason}
      />

      <Button type="submit" pending={pending} className="w-full">
        ثبت مرخصی
      </Button>
    </form>
  );
}
