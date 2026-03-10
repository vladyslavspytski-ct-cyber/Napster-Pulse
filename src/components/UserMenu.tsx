import { useNavigate } from "react-router-dom";
import { LogOut, ChevronDown, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccount } from "@/hooks/api/useAccount";

interface UserMenuProps {
  onLogout: () => void;
  /** When true, hides the text label (mobile mode) */
  compact?: boolean;
}

const UserMenu = ({ onLogout, compact = false }: UserMenuProps) => {
  const navigate = useNavigate();
  const { user } = useAccount();

  // Display name: prefer "First Last", fallback to email, then "User"
  const getDisplayName = () => {
    if (user?.first_name || user?.last_name) {
      return [user.first_name, user.last_name].filter(Boolean).join(" ");
    }
    return user?.email ?? "User";
  };

  const displayName = getDisplayName();
  const initial = (user?.first_name?.[0] || user?.email?.[0] || "U").toUpperCase();

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
        {/* Show name/email in dropdown when compact (mobile) */}
        {compact && (
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
          </div>
        )}
        <DropdownMenuItem
          onClick={() => navigate("/account")}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          My Account
        </DropdownMenuItem>
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
