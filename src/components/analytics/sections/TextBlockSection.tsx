import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TextBlockData {
  text: string;
}

export default function TextBlockSection({ title, data }: { title: string; data: TextBlockData }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.text}</p>
      </CardContent>
    </Card>
  );
}
