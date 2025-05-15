import { icons } from "./icons";

export const asideLinks = {
  HR: [
    { id: 1, title: "پیشخوان", href: "/p-hr", icon: icons.home },
    { id: 2, title: "کارمندان", href: "/p-hr/employees", icon: icons.employee },
    { id: 3, title: "مرخصی ها", href: "/p-hr/vacations", icon: icons.vacation },
    { id: 4, title: "مساعده ها", href: "/p-hr/imprests", icon: icons.dollar },
    {
      id: 5,
      title: "پروفایل",
      href: "/p-hr/profile",
      icon: icons.profile,
    },
  ],
  EMPLOYEE: [
    {
      id: 1,
      title: "پیشخوان",
      href: "/p-employee",
      icon: icons.home,
    },
    {
      id: 2,
      title: "مرخصی ها",
      href: "/p-employee/vacations",
      icon: icons.vacation,
    },
    {
      id: 3,
      title: "مساعده ها",
      href: "/p-employee/imprests",
      icon: icons.dollar,
    },
    {
      id: 4,
      title: "پروفایل",
      href: "/p-employee/profile",
      icon: icons.profile,
    },
  ],
};
