import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListData {
  variant?: "positive" | "warning" | "neutral";
  items: string[];
}

const variantConfig = {
  positive: {
    icon: CheckCircle2,
    iconClass: "text-interu-mint",
    dotClass: "bg-interu-mint",
    bgClass: "from-interu-mint/[0.04]",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-accent",
    dotClass: "bg-accent",
    bgClass: "from-accent/[0.04]",
  },
  neutral: {
    icon: Info,
    iconClass: "text-muted-foreground",
    dotClass: "bg-muted-foreground",
    bgClass: "from-muted/[0.3]",
  },
};

export default function ListSection({ title, data }: { title: string; data: ListData }) {
  const variant = data.variant ?? "neutral";
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Card className="group hover:shadow-card-hover transition-shadow duration-300 overflow-hidden relative">
      <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none", config.bgClass)} />
      <CardHeader className="pb-2 relative">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Icon className={cn("w-4 h-4", config.iconClass)} /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <ul className="space-y-2.5">
          {data.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90 leading-relaxed">
              <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0", config.dotClass)} />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
