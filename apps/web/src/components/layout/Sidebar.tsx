'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Compass, 
  Briefcase, 
  Sparkles, 
  FileText, 
  Code2, 
  Video, 
  Inbox, 
  LineChart, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

const mainNav = [
  { title: "Home", href: "/dashboard", icon: Compass },
  { title: "Jobs", href: "/jobs", icon: Briefcase },
  { title: "Career", href: "/career", icon: Sparkles },
  { title: "CV / ATS", href: "/cv", icon: FileText },
  { title: "Coding", href: "/coding", icon: Code2 },
  { title: "Interview", href: "/interview", icon: Video },
  { title: "Applications", href: "/applications", icon: Inbox },
  { title: "Insights", href: "/insights", icon: LineChart },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "flex flex-col h-screen border-r border-border bg-card/30 backdrop-blur-md transition-all duration-300 z-40 hidden md:flex",
        collapsed ? "w-[80px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight text-foreground">PrepPal</span>
          </div>
        )}
        {collapsed && (
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute flex items-center justify-center w-6 h-6 border rounded-full bg-card border-border -right-3 hover:bg-muted text-muted-foreground"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {mainNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(\`\${item.href}/\`);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.title : undefined}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors group",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <item.icon className={cn("shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4 mr-3", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors group",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <Settings className={cn("shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4 mr-3")} />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
