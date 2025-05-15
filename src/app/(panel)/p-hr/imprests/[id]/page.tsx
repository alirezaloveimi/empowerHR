import ImprestDetailsForm from "@/components/ImprestDetailsForm";
import { connectDB } from "@/lib/config/db";
import Imprest from "@/lib/models/Imprest";
import { getPersianDate } from "@/util/date";
import { priceWithDots } from "@/util/price";
import Image from "next/image";
import { redirect } from "next/navigation";

const getImprestById = async (id: string): Promise<Imprest | undefined> => {
  try {
    await connectDB();
    const imprests = await Imprest.findById(id).populate({
      path: "employee",
      populate: "position",
    });

    return imprests;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export default async function PHrImprestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const imprest = await getImprestById(id);

  if (!imprest) {
    redirect("/not-found");
  }

  const { year, month, day } = getPersianDate(imprest.requestedAt);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl">برسی مساعده کارمندان</h2>

      <div className="space-y-4">
        <div className="flex flex-col items-center md:flex-row gap-3">
          <div className="relative size-16">
            <Image
              fill
              src={imprest.employee.image.url}
              alt={imprest.employee.fullname}
              className="rounded-full border-2 border-primary"
            />
          </div>

          <div>
            <p className="font-medium text-lg">
              {imprest.employee.fullname} ({imprest.employee.position.title})
            </p>
            <p className="text-sm text-[#CBD5E1]">
              تاریخ مساعده : {day} {month.name} {year}
            </p>
          </div>
        </div>

        <div className="p-4 bg-secondary rounded-lg">
          <span className="text-sm text-muted">مبلغ مساعده : </span>
          <span className="text-2xl font-bold">
            {priceWithDots(imprest.amount)} تومان
          </span>
        </div>

        <ImprestDetailsForm
          imprestId={id}
          status={imprest.status}
          message={imprest.message}
        />
      </div>
    </div>
  );
}
