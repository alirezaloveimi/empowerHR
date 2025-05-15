import AddVacationForm from "@/components/AddVacationForm";
import { getUser } from "@/util/user";
import { redirect } from "next/navigation";

export default async function PEmployeeAddVacationPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl text-center">درخواست مرخصی جدید</h2>
      <AddVacationForm userId={`${user._id}`} />
    </div>
  );
}
