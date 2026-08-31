'use client';

import { Search, Sparkles, Bell, Sun, Moon, LogOut, User as UserIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, clearAuth, getUserInitials, isRecruiter } from "@/lib/auth";

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [userInitials, setUserInitials] = useState('AS');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserInitials(getUserInitials(user.name));
      setUserName(user.name);
      setUserRole(user.role);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
      
      <div className="flex items-center flex-1">
        <button 
          onClick={() => {
            const e = new KeyboardEvent("keydown", { key: "k", metaKey: true });
            document.dispatchEvent(e);
          }}
          className="flex items-center px-4 py-1.5 text-sm transition-colors border rounded-md text-muted-foreground border-border bg-muted/50 hover:bg-muted md:w-64"
        >
          <Search className="w-4 h-4 mr-2" />
          <span>Search...</span>
          <kbd className="inline-flex items-center h-5 px-1.5 ml-auto text-[10px] font-medium rounded border border-border bg-background text-muted-foreground font-[family-name:var(--font-jetbrains-mono)]">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      <div className="flex items-center justify-end flex-1 gap-4">
        <button 
          onClick={() => window.dispatchEvent(new Event('toggle_global_ai'))}
          className="flex items-center h-8 px-3 text-sm font-medium transition-colors border rounded-full border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-[0_0_10px_rgba(79,70,229,0.2)]"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Ask AI
        </button>
        
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-muted-foreground hover:bg-muted hover:text-foreground relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-background"></span>
          </button>
          
          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-md border border-border bg-popover text-popover-foreground shadow-md z-50 p-2">
              <div className="text-sm font-semibold mb-2 px-2 pt-1">Notifications</div>
              <div className="text-xs text-muted-foreground px-2 pb-2 border-b border-border mb-1">
                Your ATS Score improved by 5 points!
              </div>
              <div className="text-xs text-muted-foreground px-2 py-1">
                AI Interview feedback is ready.
              </div>
            </div>
          )}
        </div>

        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}

        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 rounded-full border border-border bg-primary/20 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
          >
            <span className="text-xs font-semibold text-primary">{userInitials}</span>
          </div>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-popover text-popover-foreground shadow-md z-50">
              {userName && (
                <div className="px-3 py-2.5 border-b border-border">
                  <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                  {userRole && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mt-0.5 inline-block ${
                      userRole === 'RECRUITER' ? 'bg-amber-500/10 text-amber-400' : 'bg-primary/10 text-primary'
                    }`}>
                      {userRole}
                    </span>
                  )}
                </div>
              )}
              <div className="flex flex-col p-1">
                <button 
                  onClick={() => { setShowProfileMenu(false); router.push('/profile'); }}
                  className="flex items-center px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground text-left"
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </button>
                {userRole === 'RECRUITER' && (
                  <button
                    onClick={() => { setShowProfileMenu(false); router.push('/recruiter/dashboard'); }}
                    className="flex items-center px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground text-left"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Recruiter Dashboard
                  </button>
                )}
                <div className="h-px bg-border my-1" />
                <button 
                  onClick={handleSignOut}
                  className="flex items-center px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground text-red-500 text-left"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
