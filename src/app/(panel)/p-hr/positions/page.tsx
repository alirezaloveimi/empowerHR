import Button from "@/components/Button";
import RenderList from "@/components/RenderList";
import { connectDB } from "@/lib/config/db";
import Position from "@/lib/models/Position";

const getPositions = async (): Promise<Position[]> => {
  try {
    await connectDB();
    const positions = await Position.find({}).sort({ createdAt: -1 });
    return positions;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default async function PHrPositionPage() {
  const positions = await getPositions();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:gap-0">
        <h2 className="text-2xl text-center">شغل ها</h2>
        <Button isLink href="/p-hr/positions/add" className="md:w-48">
          ثبت شغل جدید
        </Button>
      </div>

      <div className="space-y-4">
        <RenderList data={positions} text="مساعده ایی ثبت نشده">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {positions.map((position) => (
              <PositionCard key={position._id} position={position} />
            ))}
          </div>
        </RenderList>
      </div>
    </div>
  );
}

function PositionCard({ position }: { position: Position }) {
  return (
    <div className="bg-secondary p-4 rounded-xl">
      <h2 className="text-lg">{position.title}</h2>
    </div>
  );
}
