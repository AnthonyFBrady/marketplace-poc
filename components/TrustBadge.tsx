import { ShieldCheck, Shield, Flame, Sparkles, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "verified"
  | "trusted"
  | "established"
  | "community"
  | "popular"
  | "new";

const CONFIG: Record<
  BadgeVariant,
  { label: string; Icon: React.ElementType; color: string; bg: string }
> = {
  verified: {
    label: "ID Verified",
    Icon: ShieldCheck,
    color: "#2D6A4F",
    bg: "rgba(45,106,79,0.10)",
  },
  trusted: {
    label: "Trusted",
    Icon: Shield,
    color: "#2D6A4F",
    bg: "rgba(45,106,79,0.08)",
  },
  established: {
    label: "Established",
    Icon: Star,
    color: "#2D6A4F",
    bg: "rgba(45,106,79,0.08)",
  },
  community: {
    label: "Community favourite",
    Icon: Users,
    color: "#2D6A4F",
    bg: "rgba(45,106,79,0.08)",
  },
  popular: {
    label: "Popular this week",
    Icon: Flame,
    color: "#D4900F",
    bg: "rgba(212,144,15,0.10)",
  },
  new: {
    label: "New member",
    Icon: Sparkles,
    color: "#525252",
    bg: "rgba(0,0,0,0.05)",
  },
};

type Props = {
  variant: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
};

export function TrustBadge({ variant, size = "sm", className }: Props) {
  const { label, Icon, color, bg } = CONFIG[variant];
  const isSmall = size === "sm";

  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full font-medium", className)}
      style={{
        backgroundColor: bg,
        color,
        fontSize: isSmall ? "11px" : "13px",
        padding: isSmall ? "2px 8px 2px 6px" : "4px 12px 4px 8px",
        lineHeight: "1.4",
      }}
    >
      <Icon size={isSmall ? 11 : 13} strokeWidth={2.2} />
      {label}
    </span>
  );
}

export function getReviewBadge(
  reviewCount: number
): BadgeVariant | null {
  if (reviewCount === 0) return "new";
  if (reviewCount >= 50) return "community";
  if (reviewCount >= 25) return "established";
  if (reviewCount >= 10) return "trusted";
  return null;
}
