import { getPersianDate } from "@/util/date";

export default function Header() {
  const { weekDay, day, month } = getPersianDate();
  const todoy = `امروز : ${weekDay.name} ${day} ${month.name}`;

  return (
    <header className="bg-background border-b border-secondary p-5">
      <div className="container">
        <div className="flex-between-center">
          <div className="space-y-1">
            <h3 className="md:text-lg">سلام به پنل خود خوش آمدید</h3>
            <p className="font-bold text-sm md:text-base">{todoy}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
