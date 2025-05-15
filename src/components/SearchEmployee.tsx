"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import InputField from "./InputField";

export default function SearchEmployee() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [search, setSearch] = useState(searchParams.get("s")?.toString() ?? "");

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (search.trim().length) {
      params.set("s", search);
    } else {
      params.delete("s");
    }

    replace(`/p-hr/employees?${params.toString()}`);
  };

  return (
    <form onSubmit={submitHandler} className="w-full">
      <InputField
        id="search"
        label="دنبال کی هستی ؟ "
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        placeholder="(نام کاربری,شغل,اسم,فامیل)"
        type="text"
        className="w-full p-2"
      />
    </form>
  );
}
