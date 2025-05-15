import Image from "next/image";
import { getUser } from "@/util/user";
import { redirect } from "next/navigation";
import { asideLinks } from "@/data/data";
import AsideLink from "./AsideLink";
import LogoutBtn from "./LogoutBtn";

export default async function Aside() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const links = asideLinks[user.role] || [];

  return (
    <aside className="lg:col-span-3 md:sticky md:top-24">
      <div className="py-5 h-full space-y-8">
        <div>
          <div className="relative size-16">
            <Image
              fill
              alt="user-profile"
              src={user.image.url}
              className="rounded-full"
            />
          </div>

          <h3 className="text-xl mt-2">{user.fullname}</h3>
          <span className="text-xs">{user.position.title}</span>
        </div>

        <ul className="space-y-3">
          {links.map((link) => (
            <AsideLink key={link.id} {...link} />
          ))}
        </ul>

        <LogoutBtn />
      </div>
    </aside>
  );
}
