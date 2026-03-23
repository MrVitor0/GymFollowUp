export default function Loading() {
  return (
    <main className="flex-1 w-full max-w-2xl mx-auto px-4 md:px-6 lg:px-8 pt-6 pb-24 md:pb-8">
      <div className="flex flex-col gap-4">
        <div className="skeleton h-8 w-32" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="skeleton h-20" />
          <div className="skeleton h-20" />
          <div className="skeleton h-20" />
          <div className="skeleton h-20" />
        </div>
        <div className="skeleton h-32 w-full" />
        <div className="skeleton h-32 w-full" />
        <div className="skeleton h-32 w-full" />
      </div>
    </main>
  );
}
