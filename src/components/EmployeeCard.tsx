import Card from "./Card";
import Image from "next/image";

type EmployeeCardProps = {
  employee: User;
};

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <Card className="flex-align-center gap-4">
      <div className="relative size-12">
        <Image
          fill
          src={employee.image.url}
          alt={employee.username}
          className="rounded-full border-2 border-primary"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold">{employee.fullname}</h2>
        <p className="text-sm opacity-80">نام کاربری : {employee.username}</p>
        <p className="text-sm opacity-80">سمت : {employee.position.title}</p>
      </div>
    </Card>
  );
}
