"use client";

import { ChangeEvent, useActionState, useRef, useState } from "react";
import Button from "./Button";
import InputField from "./InputField";
import Image from "next/image";

import { MdFileUpload } from "react-icons/md";
import { updateUser } from "@/actions/auth";
import { toastCallback } from "@/util/toast";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type UpdateProfileFormProps = {
  userId: string;
  image: string;
  fullname: string;
  username: string;
};

export default function UpdateProfileForm({
  fullname,
  image,
  userId,
  username,
}: UpdateProfileFormProps) {
  const [file, setFile] = useState<File>();
  const { refresh } = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, action, pending] = useActionState(
    toastCallback(
      async (_: unknown, formData: FormData) => updateUser(_, formData, userId),
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

  const preview = file ? URL.createObjectURL(file) : image;

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <form action={action} className="space-y-3">
      <div className="relative size-40 mx-auto">
        <Image
          fill
          alt={fullname}
          src={preview}
          className="rounded-full object-cover"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 left-0 grid-center bg-primary rounded-full size-10"
        >
          <MdFileUpload className="text-xl" />
        </button>

        <input
          onChange={changeHandler}
          ref={fileInputRef}
          type="file"
          name="image"
          className="hidden opacity-0"
        />
      </div>

      <div className="flex flex-col md:flex-row [&>*]:flex-1 gap-4">
        <InputField
          label="اسم و فامیل"
          type="text"
          name="fullname"
          id="fullname"
          disabled
          defaultValue={fullname}
        />

        <InputField
          label="نام کاربری"
          type="text"
          name="username"
          id="username"
          defaultValue={state?.inputs?.username || username}
        />
      </div>

      <div className="flex justify-end">
        <Button className="w-48" type="submit" pending={pending}>
          ثبت تغییرات
        </Button>
      </div>
    </form>
  );
}
