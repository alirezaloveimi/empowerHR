"use client";

import { useActionState } from "react";
import Button from "./Button";
import Textarea from "./Textarea";
import { updateImprest } from "@/actions/employees";
import StatusCheckbox from "./StatusCheckbox";
import { useRouter } from "next/navigation";
import { toastCallback } from "@/util/toast";
import { toast } from "react-toastify";

type ImprestDetailsFormProps = {
  imprestId: string;
  status: Imprest["status"];
  message: string | undefined;
};

export default function ImprestDetailsForm({
  imprestId,
  message,
  status,
}: ImprestDetailsFormProps) {
  const { push } = useRouter();

  const [state, action, pending] = useActionState(
    toastCallback(
      async (_: unknown, formData: FormData) =>
        updateImprest(_, formData, imprestId),
      {
        onError(result) {
          toast.error(result.message);
        },
        onSuccess(result) {
          toast.success(result.message, {
            onClose: () => {
              push("/p-hr/imprests");
            },
          });
        },
      }
    ),
    undefined
  );

  return (
    <form action={action} className="space-y-3">
      <div className="space-y-1.5">
        <p>وضعیت درخواست مساعده : </p>

        <div className="flex-align-center gap-3">
          <StatusCheckbox
            id="ACCEPT"
            name="status"
            value="ACCEPT"
            status="ACCEPT"
            label="تایید"
            defaultChecked={(state?.inputs?.status || status) === "ACCEPT"}
          />

          <StatusCheckbox
            id="REJECT"
            name="status"
            value="REJECT"
            status="REJECT"
            label="رد"
            defaultChecked={(state?.inputs?.status || status) === "REJECT"}
          />
        </div>

        {state?.errors?.status && (
          <p className="text-sm font-bold text-red-600">
            {state?.errors?.status[0]}
          </p>
        )}
      </div>

      <Textarea
        rows={4}
        name="message"
        id="message"
        label="پاسخ به درخواست مساعده"
        defaultValue={message || state?.inputs?.message}
        errors={state?.errors?.message}
      />

      <Button className="w-full" type="submit" pending={pending}>
        ثبت تغییرات
      </Button>
    </form>
  );
}
