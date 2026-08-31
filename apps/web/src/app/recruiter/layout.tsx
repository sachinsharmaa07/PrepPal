import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { GlobalAIChat } from "@/components/layout/GlobalAIChat";
import { CommandPalette } from "@/components/layout/CommandPalette";

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isRecruiter />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container max-w-[1400px] mx-auto p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
      <CommandPalette />
      <GlobalAIChat />
    </div>
  );
}
