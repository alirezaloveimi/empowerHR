import Image from "next/image";
import Card from "./Card";
import Link from "next/link";

import { getStatusInfo } from "@/util/status";
import { FaCalendar } from "react-icons/fa";

type VacationCardProps = {
  vacation: Vacation;
  isEmployee?: boolean;
};

export default function VacationCard({
  vacation,
  isEmployee = true,
}: VacationCardProps) {
  const { statusText, statusStyle, persianDate } = getStatusInfo(
    vacation.status,
    vacation.requestDate
  );

  return (
    <Card>
      <Link
        href={`/p-${isEmployee ? "employee" : "hr"}/vacations/${vacation._id}`}
      >
        {!isEmployee ? (
          <div className="size-24 relative mx-auto">
            <Image
              fill
              src={vacation.employee.image.url}
              alt={vacation.employee.fullname}
              className="rounded-full"
            />
          </div>
        ) : (
          <div className="grid-center text-6xl my-4">
            <FaCalendar />
          </div>
        )}

        <div>
          <span
            className={`px-4 py-1 text-sm font-semibold rounded-lg text-white ${statusStyle}`}
          >
            {statusText}
          </span>
        </div>

        <p className="mt-3 mb-1 text-sm">
          {!isEmployee
            ? `${vacation.employee.fullname} (${vacation.employee.position.title})`
            : vacation.reason || "دلیلی برای مرخصی ثبت نشد"}
        </p>

        <p className="text-xs text-muted">
          تاریخ مرخصی : {persianDate.day} {persianDate.month.name}{" "}
          {persianDate.year}
        </p>
      </Link>
    </Card>
  );
}
