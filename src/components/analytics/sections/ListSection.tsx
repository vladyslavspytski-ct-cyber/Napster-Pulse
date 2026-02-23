import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListData {
  variant?: "positive" | "warning" | "neutral";
  items: string[];
}

const variantConfig = {
  positive: { icon: CheckCircle2, dotClass: "bg-emerald-500", iconClass: "text-emerald-500" },
  warning: { icon: AlertTriangle, dotClass: "bg-amber-500", iconClass: "text-amber-500" },
  neutral: { icon: Info, dotClass: "bg-muted-foreground", iconClass: "text-muted-foreground" },
};

export default function ListSection({ title, data }: { title: string; data: ListData }) {
  const variant = data.variant ?? "neutral";
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className={cn("w-4 h-4", config.iconClass)} /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {data.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
              <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0", config.dotClass)} />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
