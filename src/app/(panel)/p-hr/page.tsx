import Card from "@/components/Card";
import { getUser } from "@/util/user";
import { redirect } from "next/navigation";

import { Model, FilterQuery } from "mongoose";
import Imprest from "@/lib/models/Imprest";
import Vacation from "@/lib/models/Vacation";
import User from "@/lib/models/User";
import Link from "next/link";
import RenderList from "@/components/RenderList";
import { getStatusInfo } from "@/util/status";
import Image from "next/image";
import { priceWithDots } from "@/util/price";
import Position from "@/lib/models/Position";

const getRecords = async <T,>(
  model: Model<T>,
  shouldPopulateEmployee = true,
  filter?: FilterQuery<T>
): Promise<{ count: number; data: T[] }> => {
  try {
    const baseQuery = model
      .find({ ...filter })
      .sort({ updatedAt: -1 })
      .limit(3);
    const query = shouldPopulateEmployee
      ? baseQuery.populate({ path: "employee", populate: "position" })
      : baseQuery;

    const [count, data] = await Promise.all([
      model.countDocuments(filter),
      query,
    ]);

    return { count, data };
  } catch (e) {
    console.log(e);
    return { count: 0, data: [] };
  }
};

const getImprests = () => getRecords<Imprest>(Imprest);
const getVacations = () => getRecords<Vacation>(Vacation);
const getUsers = () => getRecords<User>(User, false, { role: "EMPLOYEE" });
const getPostions = () => getRecords<Position>(Position, false);

export default async function PHrPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { count: imprestCount, data: imprestData },
    { count: vacationCount, data: vacationData },
    { count: userCount },
    { count: positionCount },
  ] = await Promise.all([
    getImprests(),
    getVacations(),
    getUsers(),
    getPostions(),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <h2 className="text-lg font-semibold">تعداد مرخصی‌ها</h2>
          <p className="text-3xl font-bold mt-2">{vacationCount}</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">تعداد مساعده‌ها</h2>
          <p className="text-3xl font-bold mt-2">{imprestCount}</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">تعداد کارمندان</h2>
          <p className="text-3xl font-bold mt-2">{userCount}</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">تعداد شغل ها</h2>
          <p className="text-3xl font-bold mt-2">{positionCount}</p>
        </Card>
      </div>

      <div className="bg-background p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl">آخرین مرخصی‌ها</h2>

        <RenderList data={vacationData} text="مرخصی ثبت نشده">
          <ul className="space-y-3">
            {vacationData.map((vacation) => {
              const { statusText, persianDate } = getStatusInfo(
                vacation.status,
                vacation.requestDate
              );
              return (
                <li key={vacation._id}>
                  <Link
                    className="bg-secondary p-4 rounded-xl flex flex-col gap-4 md:flex-row md:justify-between md:items-center"
                    href={`/p-hr/vacations/${vacation._id}`}
                  >
                    <div className="flex flex-col items-center gap-2 md:flex-row">
                      <div className="relative size-12">
                        <Image
                          fill
                          src={vacation.employee.image.url}
                          alt="user-image"
                          className="rounded-full border-2 border-primary"
                        />
                      </div>

                      <div>
                        <p className="font-medium text-lg">
                          {vacation.employee.fullname} (
                          {vacation.employee.position.title})
                        </p>
                        <p className="text-sm text-[#CBD5E1]">
                          تاریخ مرخصی : {persianDate.day}{" "}
                          {persianDate.month.name} {persianDate.year}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm">
                      <p>دلیل مرخصی: {vacation.reason || "دلیلی نوشته نشده"}</p>
                      <p>وضیت : {statusText}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </RenderList>

        <Link
          href="/p-hr/vacations"
          className="block text-blue-500 hover:underline text-sm"
        >
          مشاهده همه‌ی مرخصی‌ها
        </Link>
      </div>

      <div className="bg-background p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl">آخرین مساعده ها</h2>

        <RenderList data={imprestData} text="مساعده ایی ثبت نشده">
          <ul className="space-y-3">
            {imprestData.map((imprest) => {
              const { statusText, persianDate } = getStatusInfo(
                imprest.status,
                imprest.requestedAt
              );
              return (
                <li key={imprest._id}>
                  <Link
                    className="bg-secondary p-4 rounded-xl flex flex-col gap-4 md:flex-row md:justify-between md:items-center"
                    href={`/p-hr/imprests/${imprest._id}`}
                  >
                    <div className="flex flex-col items-center gap-2 md:flex-row">
                      <div className="relative size-12">
                        <Image
                          fill
                          src={imprest.employee.image.url}
                          alt="user-image"
                          className="rounded-full border-2 border-primary"
                        />
                      </div>

                      <div>
                        <p className="font-medium text-lg">
                          {imprest.employee.fullname} (
                          {imprest.employee.position.title})
                        </p>
                        <p className="text-sm text-[#CBD5E1]">
                          تاریخ مساعده : {persianDate.day}{" "}
                          {persianDate.month.name} {persianDate.year}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm">
                      <p>مبلغ درخواستی : {priceWithDots(imprest.amount)}</p>
                      <p>وضیت : {statusText}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </RenderList>

        <Link
          href="/p-hr/imprests"
          className="block text-blue-500 hover:underline text-sm"
        >
          مشاهده همه‌ی مساعدها
        </Link>
      </div>
    </div>
  );
}
