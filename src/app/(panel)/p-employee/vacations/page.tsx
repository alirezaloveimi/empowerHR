import Button from "@/components/Button";
import RenderList from "@/components/RenderList";
import VacationCard from "@/components/VacationCard";
import { connectDB } from "@/lib/config/db";
import Vacation from "@/lib/models/Vacation";
import { getUser } from "@/util/user";
import { redirect } from "next/navigation";

const getVacations = async (id: string): Promise<Vacation[]> => {
  try {
    await connectDB();
    const vacations = await Vacation.find({ employee: id })
      .populate({ path: "employee", populate: "position" })
      .sort({ updatedAt: -1 });
    return vacations;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default async function PEmployeeVacationsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const vacations = await getVacations(user._id);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:gap-0">
        <h2 className="text-2xl text-center">مرخصی های من</h2>
        <Button isLink href="/p-employee/vacations/add" className="md:w-48">
          ثبت مرخصی جدید
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <RenderList data={vacations} text="مرخصی ثبت نشد">
          {vacations.map((v) => (
            <VacationCard key={v._id} vacation={v} />
          ))}
        </RenderList>
      </div>
    </div>
  );
}
