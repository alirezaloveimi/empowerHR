import AddNewImprest from "@/components/AddNewImprest";
import { priceWithDots } from "@/util/price";
import { getUser } from "@/util/user";
import { redirect } from "next/navigation";

export default async function PEmployeeAddImprestPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl text-center">درخواست مساعده جدید</h2>
        <p className="text-center text-xs">
          مبلغ مساعده برای هر ماه :
          <span className="text-primary underline px-0.5">
            {priceWithDots(user.monthlyLimit)}
          </span>
          تومان
        </p>
      </div>
      
      <AddNewImprest userId={`${user._id}`} />
    </div>
  );
}
