"use client";
import { useActionState } from "react";
import { login } from "@/actions/auth";

import InputField from "./InputField";
import Button from "./Button";
import { toastCallback } from "@/util/toast";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { refresh } = useRouter();
  const [state, action, pending] = useActionState(
    toastCallback(login, {
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
    }),
    undefined
  );

  return (
    <form action={action} className="space-y-3">
      <InputField
        type="text"
        label="نام کاربری"
        name="username"
        id="username"
        errors={state?.errors?.username}
        defaultValue={state?.inputs?.username}
      />

      <InputField
        type="password"
        label="رمز عبور"
        name="password"
        id="password"
        errors={state?.errors?.password}
        defaultValue={state?.inputs?.password}
      />

      <Button className="w-full" type="submit" pending={pending}>
        ورود
      </Button>
    </form>
  );
}
