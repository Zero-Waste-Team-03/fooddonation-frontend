import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "@/types/user.types";

type SendNotificationDialogProps = {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userId: string, title: string, body: string, type: string) => Promise<void>;
  loading: boolean;
  errorMessage: string | null;
};

export function SendNotificationDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  loading,
  errorMessage,
}: SendNotificationDialogProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("info");

  const handleConfirm = async () => {
    if (!user || !title.trim() || !body.trim()) return;
    await onConfirm(user.id, title, body, type);
    setTitle("");
    setBody("");
    setType("info");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogDescription>
            Send a notification to{" "}
            <span className="font-semibold text-foreground">
              {user?.displayName || user?.email}
            </span>
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div
            role="alert"
            className="px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive"
          >
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="notification-title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="notification-title"
              placeholder="Notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="notification-body" className="text-sm font-medium">
              Message
            </Label>
            <textarea
              id="notification-body"
              placeholder="Notification message"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={loading}
              rows={4}
              className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div>
            <Label htmlFor="notification-type" className="text-sm font-medium">
              Type
            </Label>
            <Select value={type} onValueChange={setType} disabled={loading}>
              <SelectTrigger id="notification-type" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Information</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading || !title.trim() || !body.trim()}
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
