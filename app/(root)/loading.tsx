export default function HomeLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F8F8F8]">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo / brand mark */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#F68620]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#F68620] animate-spin" />
        </div>
        <p className="text-sm font-medium text-gray-500 tracking-wider uppercase animate-pulse">
          Loading
        </p>
      </div>
    </div>
  );
}
