import Aside from "@/components/Aside";
import Header from "@/components/Header";

const PanelLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <Header />
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-5">
          <Aside />
          <div className="lg:col-span-9">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default PanelLayout;
