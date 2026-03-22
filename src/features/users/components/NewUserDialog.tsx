import { useState } from "react";
import { ShieldCheck, Building2, Gavel, Info, ChevronDown } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function NewUserDialog({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<"admin" | "org">("admin");
  const [role, setRole] = useState<"super" | "moderator">("super");

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      {/* Properly override the base dialog width with responsive max-w utilities */}
      <DialogContent className="sm:max-w-2xl md:max-w-3xl p-0 overflow-hidden border-none rounded-[32px] shadow-2xl" showCloseButton={false}>
        <div className="flex flex-col h-full w-full bg-card">
          
          {/* Header section with toggle */}
          <div className="flex justify-center pt-8 pb-4">
            <div className="flex bg-muted/50 p-1.5 rounded-2xl gap-1">
              <button
                onClick={() => setTab("admin")}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors",
                  tab === "admin" 
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ShieldCheck className="size-4" />
                New Admin
              </button>
              <button
                onClick={() => setTab("org")}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors",
                  tab === "org" 
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Building2 className="size-4" />
                New Organization
              </button>
            </div>
          </div>

          <div className="px-10 py-4 flex flex-col gap-8">
            {/* Primary Details */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2.5">
                <Label className="text-[13px] font-bold text-foreground">Full Name</Label>
                <Input 
                  placeholder="e.g. Julian Thorne" 
                  className="bg-muted/50 border-none rounded-xl h-11 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <Label className="text-[13px] font-bold text-foreground">Official Email</Label>
                <Input 
                  placeholder="julian@mindfulcurator.org" 
                  className="bg-muted/50 border-none rounded-xl h-11 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-emerald-500"
                />
              </div>
            </div>

            {/* Admin Role selection */}
            <div className="flex flex-col gap-3">
              <Label className="text-[13px] font-bold text-foreground">Administrative Role</Label>
              <div className="grid grid-cols-2 gap-4">
                {/* Super Admin Card */}
                <button
                  type="button"
                  onClick={() => setRole("super")}
                  className={cn(
                    "flex flex-col gap-1.5 p-5 rounded-xl text-left transition-colors border",
                    role === "super"
                      ? "bg-emerald-50/50 border-emerald-100 text-emerald-900"
                      : "bg-muted/40 border-transparent text-muted-foreground hover:bg-muted/60"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={cn("font-bold text-sm", role === "super" ? "text-emerald-800" : "text-foreground")}>
                      Super Admin
                    </span>
                    {role === "super" && (
                      <div className="flex size-5 rounded-full items-center justify-center bg-emerald-800 text-white">
                        <ShieldCheck className="size-3" />
                      </div>
                    )}
                  </div>
                  <p className="text-[12px] leading-relaxed opacity-80 mt-1">
                    Full system access, including financial records and audit logs.
                  </p>
                </button>

                {/* Moderator Card */}
                <button
                  type="button"
                  onClick={() => setRole("moderator")}
                  className={cn(
                    "flex flex-col gap-1.5 p-5 rounded-xl text-left transition-colors border",
                    role === "moderator"
                      ? "bg-emerald-50/50 border-emerald-100 text-emerald-900"
                      : "bg-muted/40 border-transparent text-muted-foreground hover:bg-muted/60"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={cn("font-bold text-sm", role === "moderator" ? "text-emerald-800" : "text-foreground")}>
                      Moderator
                    </span>
                    {role !== "moderator" && (
                      <Gavel className="size-5" />
                    )}
                    {role === "moderator" && (
                      <div className="flex size-5 rounded-full items-center justify-center bg-emerald-800 text-white">
                        <Gavel className="size-3" />
                      </div>
                    )}
                  </div>
                  <p className="text-[12px] leading-relaxed opacity-80 mt-1">
                    Manage donations, resolve disputes, and oversee organization profiles.
                  </p>
                </button>
              </div>
            </div>

            {/* Org Fields */}
            <div className="flex flex-col gap-6 pt-2">
              <div className="flex items-center gap-2 text-foreground">
                <Info className="size-4 opacity-50" />
                <span className="text-[13px] font-medium opacity-80">
                  Complete the section below only for multi-user organizational accounts.
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2.5">
                  <Label className="text-[13px] font-bold text-muted-foreground">Organization Name</Label>
                  <Input 
                    disabled={tab === "admin"}
                    className="bg-muted/30 border-none rounded-xl h-11 shadow-none"
                  />
                </div>
                <div className="flex flex-col gap-2.5">
                  <Label className="text-[13px] font-bold text-muted-foreground">Organization Type</Label>
                  <div className="relative">
                    <Input 
                      disabled={tab === "admin"}
                      placeholder={tab === "admin" ? "" : "NGO"}
                      className="bg-muted/30 border-none rounded-xl h-11 shadow-none pr-10 text-sm"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <Label className="text-[13px] font-bold text-muted-foreground">Location Address</Label>
                <Input 
                  disabled={tab === "admin"}
                  className="bg-muted/30 border-none rounded-xl h-11 shadow-none"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-10 py-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-orange-600"></span>
              <span className="text-[13px] font-medium text-muted-foreground">Pending background verification</span>
            </div>
            
            <div className="flex items-center gap-3">
              <DialogTrigger asChild>
                <Button variant="ghost" className="font-bold text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 px-6 rounded-xl">
                  Cancel
                </Button>
              </DialogTrigger>
              <Button className="font-bold text-white bg-[#1e6047] hover:bg-[#164a36] px-6 rounded-xl h-11">
                Create Account
              </Button>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
