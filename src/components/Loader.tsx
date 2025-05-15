export default function Loader({ ...rest }: React.CSSProperties) {
  return (
    <div
      style={{ ...rest }}
      className="border-4 border-white/30 border-t-primary rounded-full animate-spin"
    ></div>
  );
}
