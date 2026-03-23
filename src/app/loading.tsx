export default function Loading() {
  return (
    <main className="flex-1 w-full max-w-2xl mx-auto px-4 md:px-6 lg:px-8 pt-6 pb-24 md:pb-8">
      <div className="flex flex-col gap-4 animate-fade-slide-up">
        <div className="skeleton h-28 w-full" />
        <div className="skeleton h-20 w-full" />
        <div className="skeleton h-20 w-full" />
        <div className="skeleton h-20 w-full" />
        <div className="skeleton h-20 w-full" />
      </div>
    </main>
  );
}
