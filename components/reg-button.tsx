import { Button } from "./ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

export default function Regbutton({
  type,
  classname = "",
  variant = "default",
}: {
  type: string;
  classname?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}) {
  return (
    <Button variant={variant} className={cn(`group ${classname}`)}>
      {type}{" "}
      <span className="transition-transform">
        <ChevronRight className="group-hover:hidden" />
        <ArrowRight className="hidden group-hover:block" />
      </span>
    </Button>
  );
}
