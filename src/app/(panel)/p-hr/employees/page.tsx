import Button from "@/components/Button";
import Card from "@/components/Card";
import EmployeeList from "@/components/EmployeeList";
import Loader from "@/components/Loader";
import SearchEmployee from "@/components/SearchEmployee";
import { Suspense } from "react";

export default async function PHrEmployeesPage(props: {
  searchParams: Promise<{ s: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.s || "";

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-5">
        <Card className="flex-align-center lg:flex-1">
          <SearchEmployee />
        </Card>

        <Card className="flex flex-col gap-5 lg:flex-row lg:flex-between-center lg:flex-[3] lg:gap-0">
          <h2 className="text-2xl text-center">لیست کارمندان</h2>

          <Button isLink href="/p-hr/employees/add" className="lg:w-48">
            اضافه کردن کارمند جدید
          </Button>
        </Card>
      </div>

      <Suspense
        key={search}
        fallback={
          <div className="pt-8">
            <Loader width={50} height={50} marginInline="auto" />
          </div>
        }
      >
        <EmployeeList search={search} />
      </Suspense>
    </div>
  );
}
