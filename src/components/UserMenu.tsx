import { useMemo } from "react";
import { LogOut, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

/**
 * Extract email from JWT token payload.
 * Returns null if token is invalid or email is not present.
 */
function extractEmailFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JSON.parse(decoded);
    return parsed.email ?? parsed.sub ?? null;
  } catch {
    return null;
  }
}

interface UserMenuProps {
  onLogout: () => void;
  /** When true, hides the text label (mobile mode) */
  compact?: boolean;
}

const UserMenu = ({ onLogout, compact = false }: UserMenuProps) => {
  const { token } = useAuth();

  const userEmail = useMemo(() => extractEmailFromToken(token), [token]);
  const displayName = userEmail ?? "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full border border-border bg-background/60 backdrop-blur-sm pl-1 pr-2 py-1 hover:bg-accent/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="User menu"
        >
          <Avatar className="h-7 w-7 text-xs">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
              {initial}
            </AvatarFallback>
          </Avatar>
          {!compact && (
            <span className="text-sm font-medium text-foreground max-w-[140px] truncate">
              {displayName}
            </span>
          )}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {/* Show email in dropdown when compact (mobile) */}
        {compact && (
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
          </div>
        )}
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
