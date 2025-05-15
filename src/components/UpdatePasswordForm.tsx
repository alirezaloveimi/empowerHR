"use client";

import { useActionState } from "react";
import Button from "./Button";
import InputField from "./InputField";
import { updatePassword } from "@/actions/auth";
import { toastCallback } from "@/util/toast";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function UpdatePasswordForm({ userId }: { userId: string }) {
  const { refresh } = useRouter();
  const [state, action, pending] = useActionState(
    toastCallback(
      (_: unknown, formData: FormData) => updatePassword(_, formData, userId),
      {
        onError(result) {
          toast.error(result.message);
        },
        onSuccess(result) {
          toast.success(result.message, {
            onClose() {
              refresh();
            },
          });
        },
      }
    ),
    undefined
  );

  return (
    <form action={action} className="space-y-3">
      <div className="flex flex-col items-stretch md:flex-row [&>*]:flex-1 gap-4">
        <InputField
          label="رمز فعلی"
          type="password"
          name="currentPassword"
          id="currentPassword"
          defaultValue={state?.inputs?.currentPassword}
          errors={state?.errors?.currentPassword}
        />

        <InputField
          label="رمز جدید"
          type="password"
          name="newPassword"
          id="newPassword"
          defaultValue={state?.inputs?.newPassword}
          errors={state?.errors?.newPassword}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" pending={pending} className="w-48">
          ویرایش رمز عبور
        </Button>
      </div>
    </form>
  );
}
