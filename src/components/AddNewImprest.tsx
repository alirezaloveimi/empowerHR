"use client";

import { addImprest } from "@/actions/employees";
import { useActionState } from "react";
import Button from "./Button";
import InputField from "./InputField";
import { toastCallback } from "@/util/toast";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type AddNewImprestProps = {
  userId: string;
};

export default function AddNewImprest({ userId }: AddNewImprestProps) {
  const { push } = useRouter();
  const [state, action, pending] = useActionState(
    toastCallback(
      async (prevState: unknown, formData: FormData) =>
        addImprest(prevState, formData, userId),
      {
        onError(result) {
          toast.error(result.message);
        },
        onSuccess(result) {
          toast.success(result.message, {
            onClose: () => {
              push("/p-employee/imprests");
            },
          });
        },
      }
    ),
    undefined
  );

  return (
    <form action={action} className="space-y-3">
      <InputField
        type="number"
        name="amount"
        id="amount"
        label="مبلغ مساعده (تومان)"
        key={`employee-amount-${state?.inputs?.amount}`}
        defaultValue={state?.inputs?.amount}
        errors={state?.errors?.amount}
      />

      <Button type="submit" pending={pending} className="w-full">
        درخواست مساعده
      </Button>
    </form>
  );
}
