import { connectDB } from "@/lib/config/db";
import User from "@/lib/models/User";
import RenderList from "./RenderList";
import EmployeeCard from "./EmployeeCard";

type EmployeeListProps = {
  search: string;
};

const getEmployees = async (search: string): Promise<User[]> => {
  try {
    await connectDB();
    const employees = await User.find({ role: "EMPLOYEE" })
      .populate("position", "title")
      .sort({
        createdAt: -1,
      });

    const filteredEmployees = employees.filter(
      ({ fullname, username, position }) =>
        [fullname, username?.toLowerCase(), position?.title].some((field) =>
          field?.toLowerCase().includes(search.toLowerCase())
        )
    );

    return filteredEmployees;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default async function EmployeeList({ search }: EmployeeListProps) {
  const employees = await getEmployees(search);

  return (
    <RenderList text="کارمندی یافت نشد" data={employees}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-8">
        {employees.map((employee) => (
          <EmployeeCard key={employee._id} employee={employee} />
        ))}
      </div>
    </RenderList>
  );
}
