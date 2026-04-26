interface PageShellProps {
  children: React.ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900 min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-screen-2xl mx-auto p-4 lg:p-6">
        {children}
      </div>
    </main>
  );
}
