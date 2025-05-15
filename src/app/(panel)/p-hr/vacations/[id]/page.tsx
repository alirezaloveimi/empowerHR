import Card from "@/components/Card";
import VacationDetailsForm from "@/components/VacationDetailsForm";
import { connectDB } from "@/lib/config/db";
import Vacation from "@/lib/models/Vacation";
import { getStatusInfo } from "@/util/status";
import Image from "next/image";
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

export default async function PHrVacationDetails({
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
      <h2 className="text-2xl">برسی درخواست مرخصی</h2>

      <Card className="space-y-4">
        <div>
          <span
            className={`px-4 py-1 text-sm font-semibold rounded-lg text-white ${statusStyle}`}
          >
            {statusText}
          </span>
        </div>

        <div className="flex flex-col items-center md:flex-row gap-3">
          <div className="relative size-16">
            <Image
              fill
              src={vacation.employee.image.url}
              alt={vacation.employee.fullname}
              className="rounded-full border-2 border-primary"
            />
          </div>

          <div className="space-y-1">
            <p className="font-medium text-lg">
              {vacation.employee.fullname} ({vacation.employee.position.title})
            </p>

            <p className="text-sm">
              تاریخ مرخصی : {persianDate.day} {persianDate.month.name}
              {persianDate.year}
            </p>

            <p className="text-sm">
              <strong>دلیل مرخصی : </strong>
              {vacation.reason ? vacation.reason : "دلیلی ثبت نشده"}
            </p>
          </div>
        </div>
      </Card>

      <VacationDetailsForm
        vacationId={id}
        message={vacation.message}
        status={vacation.status}
      />
    </div>
  );
}
