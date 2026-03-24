import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

export function UserFilters() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between mt-8 mb-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input 
          placeholder="Search by name or email..." 
          className="h-11 pl-10 text-sm"
        />
      </div>
      
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 h-11 px-5 rounded-xl bg-card text-[13px] font-semibold text-muted-foreground shadow-sm hover:text-foreground transition-colors">
          Role: All
          <ChevronDown className="size-4 opacity-50 ml-1" />
        </button>
        <button className="flex items-center gap-2 h-11 px-5 rounded-xl bg-card text-[13px] font-semibold text-muted-foreground shadow-sm hover:text-foreground transition-colors">
          Status: All
          <ChevronDown className="size-4 opacity-50 ml-1" />
        </button>
      </div>
    </div>
  );
}
