import Card from "@/components/Card";
import RenderList from "@/components/RenderList";
import Imprest from "@/lib/models/Imprest";
import Vacation from "@/lib/models/Vacation";
import { priceWithDots } from "@/util/price";
import { getStatusInfo } from "@/util/status";
import { getUser } from "@/util/user";
import { FilterQuery } from "mongoose";
import { Model } from "mongoose";
import Link from "next/link";
import { redirect } from "next/navigation";

const getRecords = async <T,>(
  model: Model<T>,
  filter?: FilterQuery<T>
): Promise<{ count: number; data: T[] }> => {
  try {
    const [count, data] = await Promise.all([
      model.countDocuments(filter),
      model
        .find({ ...filter })
        .sort({ updatedAt: -1 })
        .limit(3),
    ]);

    return { count, data };
  } catch (e) {
    console.log(e);
    return { count: 0, data: [] };
  }
};

const getImprests = (userId: string) =>
  getRecords<Imprest>(Imprest, { employee: userId });
const getVacations = (userId: string) =>
  getRecords<Vacation>(Vacation, { employee: userId });

export default async function PEmployeePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { count: imprestCount, data: imprestData },
    { count: vacationCount, data: vacationData },
  ] = await Promise.all([getImprests(user._id), getVacations(user._id)]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold">تعداد مرخصی‌های من</h2>
          <p className="text-3xl font-bold mt-2">{vacationCount}</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">تعداد مساعده‌های من</h2>
          <p className="text-3xl font-bold mt-2">{imprestCount}</p>
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
                    className="block bg-secondary p-4 rounded-xl"
                    href={`/p-employee/vacations/${vacation._id}`}
                  >
                    <div className="text-sm">
                      <p>دلیل مرخصی: {vacation.reason || "دلیلی نوشته نشده"}</p>
                      <p>
                        تاریخ مرخصی : {persianDate.day} {persianDate.month.name}{" "}
                        {persianDate.year}
                      </p>
                      <p>وضعیت : {statusText}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </RenderList>

        <Link
          href="/p-employee/vacations"
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
                <li key={imprest._id} className="bg-secondary p-4 rounded-xl">
                  <div className="text-sm">
                    <p>مبلغ مساعده : {priceWithDots(imprest.amount)} تومان </p>
                    <p>
                      تاریخ مساعده : {persianDate.day} {persianDate.month.name}{" "}
                      {persianDate.year}
                    </p>
                    <p>وضعیت : {statusText}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </RenderList>

        <Link
          href="/p-employee/imprests"
          className="block text-blue-500 hover:underline text-sm"
        >
          مشاهده همه‌ی مساعده ها
        </Link>
      </div>
    </div>
  );
}
