"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { ArrowRight } from "lucide-react";

export default function Cluster() {
  return (
    <div className="w-full h-full items-center justify-center flex max-h-screen overflow-hidden p-4">
      <Card className="bg-secondary p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-bold">
            Manage Your Clusters
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Organize your documents efficiently by creating a cluster.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Clusters help you group related documents together, making retrieval
            and collaboration easier.
          </p>
          <Link
            href="/dashboard/cluster"
            className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
          >
            <ArrowRight size={16} />
            Learn more about clusters
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
