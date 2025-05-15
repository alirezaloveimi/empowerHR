import Button from "@/components/Button";
import Image from "next/image";
import React from "react";

export default function NotFound() {
  return (
    <div className="h-screen grid-center space-y-5">
      <Image
        quality={100}
        width={500}
        height={500}
        src="/images/notfound.jpg"
        alt="not-found"
        className="mx-auto"
      />

      <h2 className="text-2xl text-center">چنین صفحه ایی پیدا نشد</h2>

      <div className="flex justify-center">
        <Button className="w-48" isLink href="/">
          بازگشت به خانه
        </Button>
      </div>
    </div>
  );
}
