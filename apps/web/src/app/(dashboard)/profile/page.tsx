'use client';

import { User, Code2, Trophy, Clock, BrainCircuit, Target, Video, Briefcase, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
  const [skills, setSkills] = useState<{name: string}[]>([]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Mock user id that we use everywhere for MVP
        const res = await fetch('/api/profile?userId=dummy-user-id');
        const data = await res.json();
        
        if (data.solvedProblems) {
          setSolvedProblems(data.solvedProblems);
        }
        if (data.profile?.skillTags) {
          setSkills(data.profile.skillTags);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    }
    fetchProfile();
    
    // Listen for solves from the coding IDE
    const handleSolve = () => fetchProfile();
    window.addEventListener('problem_solved', handleSolve);
    return () => window.removeEventListener('problem_solved', handleSolve);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full py-8">
        
        {/* Header section */}
        <div className="flex items-start gap-6 border border-border p-6 rounded-xl bg-card">
          <div className="w-24 h-24 rounded-full border-2 border-primary/20 bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground shadow-inner">
            AS
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Alex Software</h1>
            <p className="text-muted-foreground flex items-center mt-1 mb-3">
              <Briefcase className="w-4 h-4 mr-2" /> Full Stack Engineer • Actively Interviewing
            </p>
            
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md text-xs font-medium">
                    {skill.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-4 mt-2">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Rank</span>
                <span className="text-sm font-medium text-amber-500 flex items-center"><Trophy className="w-3 h-3 mr-1" /> Guardian</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Global</span>
                <span className="text-sm font-medium text-foreground">Top 4%</span>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LeetCode Style Progress Tracker */}
          <div className="col-span-1 border border-border rounded-xl bg-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center"><Code2 className="w-5 h-5 mr-2 text-primary" /> Problem Solving</h2>
            </div>
            
            <div className="flex items-center gap-6 mb-6">
              {/* Circular Progress Mock */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" className="stroke-muted fill-none stroke-[8]" />
                  <circle cx="50" cy="50" r="45" className="stroke-primary fill-none stroke-[8] stroke-dasharray-[283] stroke-dashoffset-[100] transition-all duration-1000" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold text-foreground">{solvedProblems.length}</span>
                  <span className="text-xs text-muted-foreground">Solved</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <div className="flex flex-col">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-green-500 font-medium">Easy</span>
                    <span className="text-muted-foreground">{solvedProblems.length} / 700</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-green-500 w-[12%]" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-amber-500 font-medium">Medium</span>
                    <span className="text-muted-foreground">51 / 1500</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-amber-500 w-[4%]" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-red-500 font-medium">Hard</span>
                    <span className="text-muted-foreground">7 / 600</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-red-500 w-[1%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto border-t border-border pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase">Current Streak</span>
                  <span className="text-lg font-medium text-foreground flex items-center">14 Days <span className="text-orange-500 ml-1">🔥</span></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase">Max Streak</span>
                  <span className="text-lg font-medium text-foreground">42 Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Interview & ATS History */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
            
            <div className="border border-border rounded-xl bg-card p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center"><Target className="w-5 h-5 mr-2 text-primary" /> ATS Score History</h2>
                <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-md font-medium border border-green-500/20">Excellent</span>
              </div>
              <div className="flex items-end gap-2 h-32 mt-4 pb-2 border-b border-border">
                {[65, 70, 72, 78, 85, 84, 88, 92, 94].map((score, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-primary/20 rounded-t-sm relative hover:bg-primary/40 transition-colors" style={{ height: `${score}%` }}>
                       <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow border border-border whitespace-nowrap transition-opacity">
                         {score} / 100
                       </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3 flex items-center">
                <FileText className="w-4 h-4 mr-1" /> Your resume is highly optimized for current roles.
              </p>
            </div>

            <div className="border border-border rounded-xl bg-card p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center"><Video className="w-5 h-5 mr-2 text-primary" /> Recent AI Interviews</h2>
                <button className="text-xs text-primary hover:underline">View All</button>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                      89
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">Backend System Design</span>
                      <span className="text-xs text-muted-foreground flex items-center"><Clock className="w-3 h-3 mr-1" /> 2 days ago</span>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/30">Strong Hire</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                      72
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">Frontend React Hooks</span>
                      <span className="text-xs text-muted-foreground flex items-center"><Clock className="w-3 h-3 mr-1" /> 1 week ago</span>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">Lean Hire</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
