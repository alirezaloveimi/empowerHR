"use client";

import { useActionState, useEffect, useState } from "react";
import InputField from "./InputField";
import Button from "./Button";
import Select from "./Select";
import Uploader from "./Uploader";
import { register } from "@/actions/auth";
import { toastCallback } from "@/util/toast";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function AddNewEmployeeForm() {
  const { push } = useRouter();

  const [state, action, pending] = useActionState(
    toastCallback(register, {
      onError(result) {
        toast.error(result.message);
      },
      onSuccess(result) {
        toast.success(result.message, {
          onClose: () => {
            push("/p-hr/employees");
          },
        });
      },
    }),
    undefined
  );

  const [file, setFile] = useState<File | null>(null);
  const [options, setOptions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPositions = async () => {
      try {
        const res = await fetch("/api/position");
        const data = await res.json();
        setOptions(data);
      } catch (e) {
        console.log(e);
        return [];
      } finally {
        setLoading(false);
      }
    };

    getPositions();
  }, []);

  const addNewEmployeeAction = (formData: FormData) => {
    action(formData);
    setFile(null);
  };

  return (
    <form action={addNewEmployeeAction} className="space-y-3">
      <div className="flex flex-col md:flex-row [&>*]:flex-1 gap-4">
        <InputField
          label="اسم و فامیل"
          type="text"
          name="fullname"
          id="fullname"
          errors={state?.errors?.fullname}
          defaultValue={state?.inputs?.fullname}
        />

        <InputField
          label="نام کاربری"
          type="text"
          name="username"
          id="username"
          errors={state?.errors?.username}
          defaultValue={state?.inputs?.username}
        />

        <InputField
          label="رمز عبور"
          type="password"
          name="password"
          id="password"
          errors={state?.errors?.password}
          defaultValue={state?.inputs?.password}
        />
      </div>

      <div className="flex flex-col md:flex-row [&>*]:flex-1 gap-4">
        <Select
          label="موقعیت شغلی"
          key={`select-position-${state?.inputs?.position ?? "-1"}`}
          name="position"
          defaultValue={state?.inputs?.position ?? "-1"}
          data={options}
          pendign={loading}
          error={state?.errors?.position}
          renderItem={(item) => (
            <option key={item._id} value={item._id}>
              {item.title}
            </option>
          )}
        />
      </div>

      <div>
        <Uploader
          label="عکس کارمند"
          file={file}
          name="image"
          height={144}
          onChange={(file) => setFile(file)}
          error={state?.errors?.image}
        />
      </div>

      <Button type="submit" pending={pending} className="w-full">
        اضافه کردن کارمند جدید
      </Button>
    </form>
  );
}
