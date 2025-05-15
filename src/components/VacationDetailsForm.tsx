"use client";

import { toast } from "react-toastify";
import Button from "./Button";
import Textarea from "./Textarea";
import { toastCallback } from "@/util/toast";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import StatusCheckbox from "./StatusCheckbox";
import { updateVacation } from "@/actions/employees";

type VacationDetailsFormProps = {
  vacationId: string;
  status: Status;
  message: string | undefined;
};

export default function VacationDetailsForm({
  message,
  status,
  vacationId,
}: VacationDetailsFormProps) {
  const { push } = useRouter();

  const [state, action, pending] = useActionState(
    toastCallback(
      async (_: unknown, formData: FormData) =>
        updateVacation(_, formData, vacationId),
      {
        onError(result) {
          toast.error(result.message);
        },
        onSuccess(result) {
          toast.success(result.message, {
            onClose: () => {
              push("/p-hr/vacations");
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
        <p>وضعیت درخواست مرخصی : </p>

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
        label="پاسخ به درخواست مرخصی"
        defaultValue={message || state?.inputs?.message}
        errors={state?.errors?.message}
      />

      <Button className="w-full" type="submit" pending={pending}>
        ثبت تغییرات
      </Button>
    </form>
  );
}
