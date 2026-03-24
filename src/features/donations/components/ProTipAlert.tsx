import { Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProTipAlert() {
  return (
    <div className="mt-8 relative overflow-hidden rounded-2xl border border-amber-200/50 bg-[#fffdf0] px-6 py-4 dark:border-amber-900/50 dark:bg-amber-950/20">
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fdeecb] text-amber-700 dark:bg-amber-900/50 flex-none">
          <Lightbulb className="size-5" />
        </div>
        <div className="flex flex-col gap-0.5 pr-8 mt-0.5">
          <h4 className="font-bold text-[#b45309] dark:text-amber-500 text-[14px]">Pro-tip for Moderation</h4>
          <p className="text-[13px] text-[#d97706] dark:text-amber-500/80 font-medium leading-relaxed">
            Donations with high urgency (less than 2 hours left) are automatically prioritized at the top of the 'Active' queue for quicker matching.
          </p>
        </div>
        <div className="absolute right-3 top-3">
          <Button variant="ghost" size="icon" className="size-8 text-amber-600/60 hover:text-amber-800 hover:bg-amber-100/50 dark:hover:bg-amber-900/50 rounded-full">
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
