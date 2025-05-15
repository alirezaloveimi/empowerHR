import Button from "@/components/Button";
import ImprestCard from "@/components/ImprestCard";
import RenderList from "@/components/RenderList";
import { connectDB } from "@/lib/config/db";
import Imprest from "@/lib/models/Imprest";
import { getUser } from "@/util/user";
import { redirect } from "next/navigation";

const getImprests = async (userId: string): Promise<Imprest[]> => {
  try {
    await connectDB();
    const imprests = await Imprest.find({ employee: userId })
      .sort({ updatedAt: -1 })
      .populate("employee");
    return imprests;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default async function PEmployeeImprestsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const imprests = await getImprests(user._id);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:gap-0">
        <h2 className="text-2xl text-center">مساعده های من</h2>
        <Button isLink href="/p-employee/imprests/add" className="md:w-48">
          ثبت مساعده جدید
        </Button>
      </div>

      <div className="space-y-4">
        <RenderList data={imprests} text="مساعده ایی یافت نشد">
          {imprests.map((item) => (
            <ImprestCard key={item._id} imprest={item} />
          ))}
        </RenderList>
      </div>
    </div>
  );

}
