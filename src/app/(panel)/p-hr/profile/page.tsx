import UpdatePasswordForm from "@/components/UpdatePasswordForm";
import UpdateProfileForm from "@/components/UpdateProfileForm";
import { getUser } from "@/util/user";
import { redirect } from "next/navigation";

export default async function PHrProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-4 [&>div]:space-y-4">
      <div>
        <h2 className="text-2xl">ویرایش پروفایل</h2>

        <UpdateProfileForm
          userId={`${user._id}`}
          image={user.image.url}
          username={user.username}
          fullname={user.fullname}
        />
      </div>

      <div>
        <h2 className="text-2xl">تغییر رمز عبور</h2>

        <UpdatePasswordForm userId={`${user._id}`} />
      </div>
    </div>
  );
}
