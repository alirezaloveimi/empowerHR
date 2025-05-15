import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="lg:h-screen lg:grid lg:grid-cols-2">
      <div className="flex flex-col justify-center p-6 h-screen lg:h-auto">
        <div className="mb-5 space-y-2 text-center">
          <h1 className="text-4xl">سلام!</h1>
          <p>به پنل توان افزار خوش آمدید</p>
        </div>

        <LoginForm />
      </div>
      <div className="hidden lg:block relative">
        <Image
          fill
          className="object-cover"
          src="/images/login.webp"
          alt="login-image"
        />
      </div>
    </div>
  );
}
