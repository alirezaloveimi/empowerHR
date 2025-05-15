import Card from "@/components/Card";
import { connectDB } from "@/lib/config/db";
import Vacation from "@/lib/models/Vacation";
import { getStatusInfo } from "@/util/status";
import { redirect } from "next/navigation";

const getVacation = async (id: string): Promise<Vacation | undefined> => {
  try {
    await connectDB();
    const vacation = await Vacation.findById(id).populate({
      path: "employee",
      populate: "position",
    });

    return vacation;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export default async function PEmployeeVacationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vacation = await getVacation(id);

  if (!vacation) {
    redirect("/not-found");
  }

  const { statusText, statusStyle, persianDate } = getStatusInfo(
    vacation.status,
    vacation.requestDate
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl">وضعیت مرخصی من</h2>

      <Card className="space-y-4">
        <p className="text-xs text-muted">
          تاریخ مرخصی : {persianDate.day} {persianDate.month.name}{" "}
          {persianDate.year}
        </p>

        <div>
          <span
            className={`px-4 py-1 text-sm font-semibold rounded-lg text-white ${statusStyle}`}
          >
            {statusText}
          </span>
        </div>

        <div className="bg-[#475569] p-4 rounded-lg">
          <p className="font-medium">پاسخ منابع انسانی : </p>
          <p className="mt-1 text-sm">
            {vacation?.message
              ? vacation.message
              : "منابع انسانی هنوز پاسخی نداده است..."}
          </p>
        </div>
      </Card>
    </div>
  );
}
