export const IframeDashboard = () => {
  return (
    <div className="w-full h-full p-12">
      <div
        className="relative w-full h-full overflow-hidden"
        style={{ paddingTop: "56.25%" }}
      >
        <iframe
          src="https://dorahack-arc.vercel.app"
          className="absolute top-0 left-0 w-full h-full border-0"
          allowFullScreen
        />
      </div>
    </div>
  );
};
