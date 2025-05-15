import { priceWithDots } from "@/util/price";
import { getStatusInfo } from "@/util/status";

type ImprestProps = {
  imprest: Imprest;
};

export default function ImprestCard({ imprest }: ImprestProps) {
  const { statusText, statusStyle, persianDate } = getStatusInfo(
    imprest.status,
    imprest.requestedAt
  );

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-secondary p-4 rounded-lg">
      <div>
        <p className="font-medium">سال : {persianDate.year}</p>
        <p className="text-sm">
          {persianDate.day} {persianDate.month.name}
        </p>
      </div>

      <div>
        <p className="font-medium">
          مساعده خواسته شده : {priceWithDots(imprest.amount)} تومان
        </p>
      </div>

      <div className="flex-align-center gap-2 ml-4 text-sm">
        <span className="text-muted">جواب منابع انسانی :</span>
        <span>{imprest.message ? imprest.message : " جوابی داده نشده"}</span>
      </div>

      <div>
        <span
          className={`px-4 py-1 text-xs font-bold rounded-lg text-white ${statusStyle}`}
        >
          {statusText}
        </span>
      </div>
    </div>
  );
}
