import RenderList from "@/components/RenderList";
import { connectDB } from "@/lib/config/db";
import Imprest from "@/lib/models/Imprest";
import { priceWithDots } from "@/util/price";
import { getStatusInfo } from "@/util/status";
import Image from "next/image";
import Link from "next/link";

const getImprests = async (): Promise<Imprest[]> => {
  try {
    await connectDB();
    const imprests = await Imprest.find({})
      .populate({ path: "employee", populate: "position" })
      .sort({ updatedAt: -1 });

    return imprests;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default async function PHrimprestsPage() {
  const imprests = await getImprests();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl">لیست مساعده کارمندان</h2>

      <div className="space-y-4">
        <RenderList data={imprests} text="مساعده ایی ثبت نشده">
          {imprests.map((item) => (
            <PHrImprestCard key={item._id} imprest={item} />
          ))}
        </RenderList>
      </div>
    </div>
  );
}

function PHrImprestCard({ imprest }: { imprest: Imprest }) {
  const { statusText, statusStyle, persianDate } = getStatusInfo(
    imprest.status,
    imprest.requestedAt
  );

  return (
    <Link className="block" href={`/p-hr/imprests/${imprest._id}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-secondary p-4 rounded-lg">
        <div className="flex-align-center gap-x-3">
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
              {imprest.employee.fullname} ({imprest.employee.position.title})
            </p>
            <p className="text-sm text-[#CBD5E1]">
              تاریخ مساعده : {persianDate.day} {persianDate.month.name}{" "}
              {persianDate.year}
            </p>
          </div>
        </div>

        <p className="text-lg font-bold">
          {priceWithDots(imprest.amount)} تومان
        </p>

        <div>
          <span
            className={`px-4 py-1 text-sm font-semibold rounded-lg text-white ${statusStyle}`}
          >
            {statusText}
          </span>
        </div>
      </div>
    </Link>
  );
}
