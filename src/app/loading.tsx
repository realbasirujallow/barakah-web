export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-[#1B5E20] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#1B5E20] font-semibold text-lg">Loading…</p>
      </div>
    </div>
  );
}
