import { cn } from "@/lib/cn";

type StateMessageProps = {
  message: string;
  tone?: "default" | "danger";
  variant?: "plain" | "panel";
};

export function StateMessage({ message, tone = "default", variant = "plain" }: StateMessageProps) {
  return (
    <div
      className={cn(
        "p-8 text-center text-sm",
        tone === "danger" ? "text-red-700" : "text-muted",
        variant === "panel" && "rounded-lg border bg-white",
        variant === "panel" && tone === "danger" && "border-red-100",
        variant === "panel" && tone !== "danger" && "border-slate-200"
      )}
    >
      {message}
    </div>
  );
}
