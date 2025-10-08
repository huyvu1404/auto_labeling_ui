import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <SidebarInset className="flex-1">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-sidebar-background">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <img
              src="https://kompa.ai/assets/images/logo.svg"
              alt="Kompa Logo"
              className="h-8"
            />
            <span className="text-lg font-semibold text-sidebar-foreground">
             Social Listening Auto Labeling
            </span>
          </div>
        </header>
        <main className="flex-1 p-6 bg-background">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}