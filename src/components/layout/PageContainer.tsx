interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main
      className={`
        flex-1 w-full max-w-2xl mx-auto
        px-4 md:px-6 lg:px-8
        pt-6 pb-24 md:pb-8
        ${className ?? ""}
      `}
    >
      {children}
    </main>
  );
}
