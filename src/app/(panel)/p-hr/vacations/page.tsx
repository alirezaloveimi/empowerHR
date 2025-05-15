import RenderList from "@/components/RenderList";
import VacationCard from "@/components/VacationCard";
import { connectDB } from "@/lib/config/db";
import Vacation from "@/lib/models/Vacation";

const getVacations = async () => {
  try {
    await connectDB();
    const vacations = await Vacation.find({})
      .populate({
        path: "employee",
        populate: "position",
      })
      .sort({ updatedAt: -1 });

    return vacations;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default async function PHrVacationsPage() {
  const vacations = await getVacations();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl">مرخصی های کارمندان</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <RenderList data={vacations} text="مرخصی ثبت نشد">
          {vacations.map((v) => (
            <VacationCard isEmployee={false} key={v._id} vacation={v} />
          ))}
        </RenderList>
      </div>
    </div>
  );
}
