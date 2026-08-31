'use client';

import Link from "next/link";
import { Mic, Video as VideoIcon, PhoneOff, Sparkles, Activity, MicOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCompatChat } from "@/hooks/useCompatChat";

export default function InterviewLiveRoomPage() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const { messages, sendMessage, isLoading } = useCompatChat({
    api: '/api/chat',
  });

  // Initialize with a default question if chat is empty
  useEffect(() => {
    if (messages.length === 0) {
      setInitialQuestion("Tell me about a system you designed that had to handle significant scale. What were the specific bottlenecks you encountered?");
    }
  }, []);

  const [initialQuestion, setInitialQuestion] = useState<string>("Tell me about a system you designed that had to handle significant scale.");

  const lastAssistantMsg = messages.filter((m) => m.role === 'assistant').pop();
  const currentAIQuestion = lastAssistantMsg?.content || initialQuestion;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');

        try {
          const res = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (data.text) {
            sendMessage({ text: data.text });
          }
        } catch (error) {
          console.error("Transcription failed", error);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center animate-in fade-in duration-700">
      
      {/* Calm, immersive room container */}
      <div className="w-full max-w-4xl h-[700px] flex flex-col border rounded-3xl bg-card/50 backdrop-blur-md border-border shadow-2xl overflow-hidden relative">
        
        {/* Top: AI Interviewer */}
        <div className="flex-1 flex flex-col items-center justify-center p-12 border-b border-border/50 relative">
          {/* Subtle glowing orb representing AI */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-cyan-500 mb-8 flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.3)]">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <p className="text-2xl font-medium tracking-tight text-foreground max-w-2xl leading-relaxed">
              {isLoading ? (
                <span className="animate-pulse text-muted-foreground">Thinking...</span>
              ) : (
                currentAIQuestion
              )}
            </p>
          </div>

          <div className="absolute top-6 left-6 text-sm font-medium text-muted-foreground font-[family-name:var(--font-jetbrains-mono)]">
            18:42
          </div>
          <div className="absolute top-6 right-6 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border border-border bg-background text-muted-foreground">
            Backend Engineer
          </div>
        </div>

        {/* Bottom: Candidate (You) */}
        <div className="h-64 bg-background p-8 flex flex-col justify-between">
          
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 rounded-xl bg-muted border border-border overflow-hidden relative flex items-center justify-center">
              {/* Fake camera feed placeholder */}
              <span className="text-muted-foreground text-sm font-medium">Camera Off</span>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1">
                <span className="w-1.5 h-4 bg-emerald-500 rounded-full animate-pulse" />
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full animate-pulse delay-75" />
                <span className="w-1.5 h-3 bg-emerald-500 rounded-full animate-pulse delay-150" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">You</h3>
                {isRecording && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <Activity className="w-3 h-3 animate-pulse" /> Recording
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{isRecording ? "Listening to your response..." : "Click mic to speak"}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={toggleRecording}
              className={`flex items-center justify-center w-12 h-12 rounded-full border transition-colors shadow-sm ${isRecording ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-border bg-card hover:bg-muted text-foreground'}`}
            >
              {isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-full border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-sm opacity-50 cursor-not-allowed">
              <VideoIcon className="w-5 h-5" />
            </button>
            <Link 
              href="/interview/feedback"
              className="flex items-center justify-center w-14 h-14 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-lg"
            >
              <PhoneOff className="w-6 h-6" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
