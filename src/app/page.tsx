import Button from "@/components/Button";

export default function HomePage() {
  return (
    <div className="grid-center h-screen space-y-5 text-center">
      <h1 className="text-4xl">سامانه مدیریت کارمندان</h1>
      <p>خوش آمدید! این سامانه برای مدیریت کارمندان طراحی شده است.</p>

      <Button isLink href="/login" className="w-full">
        ورود به سامانه
      </Button>
    </div>
  );
}
