import Link from "next/link";
import { Card } from "../../../components/ui/card";
import { ArrowRight } from "lucide-react";

const STATS = [
  {
    title: "Total Clusters",
    numbers: 23,
    href: "cluster",
    linkTitle: "My Clusters",
  },
  {
    title: "Total Documents",
    numbers: 12,
    href: "documents",
    linkTitle: "My documents",
  },
  {
    title: "Total Links",
    numbers: 8,
    href: "links",
    linkTitle: "My Links",
  },
];

export default function Dashboard() {
  return (
    <div className="p-4 flex flex-col">
      <h1 className="text-xl">Hi, Kelly Limo</h1>
      <p className="text-[0.8rem] text-muted-foreground">
        Your dashboard provides an overview of all your clusters, documents and links.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 w-full">
        {STATS.map((stat, index) => (
          <StatCard
            href={stat.href}
            linkTitle={stat.linkTitle}
            numbers={stat.numbers}
            title={stat.title}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}

const StatCard = ({
  title,
  numbers = 0,
  href,
  linkTitle,
}: {
  title: string;
  numbers: number;
  href: string;
  linkTitle: string;
}) => {
  return (
    <Card className="p-5 flex items-center md:items-start justify-between bg-secondary rounded-lg shadow-md transition-all hover:shadow-lg">
      <div>
        <h2 className="text-base font-medium text-muted-foreground">{title}</h2>
        <p className="text-3xl font-bold text-primary">{numbers}</p>
      </div>
      <Link
        href={`/dashboard/${href}`}
        className="text-sm font-medium text-primary hover:underline flex items-center"
      >
        {linkTitle}{" "}
        <span>
          <ArrowRight size={16} />
        </span>
      </Link>
    </Card>
  );
};
