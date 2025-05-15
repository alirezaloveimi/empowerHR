"use client";

import { addPosition } from "@/actions/employees";
import { toastCallback } from "@/util/toast";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "react-toastify";
import Button from "./Button";
import InputField from "./InputField";

export default function AddNewPositionForm() {
  const { push } = useRouter();

  const [state, action, pending] = useActionState(
    toastCallback(addPosition, {
      onError(result) {
        toast.error(result.message);
      },
      onSuccess(result) {
        toast.success(result.message, {
          onClose() {
            push("/p-hr/positions");
          },
        });
      },
    }),
    undefined
  );

  return (
    <form action={action} className="space-y-3">
      <InputField
        label="عنوان شغل جدید (فارسی)"
        type="text"
        name="title"
        defaultValue={state?.inputs?.title}
        errors={state?.errros?.title}
      />

      <Button className="w-full" type="submit" pending={pending}>
        ایجاد شغل جدید
      </Button>
    </form>
  );
}
