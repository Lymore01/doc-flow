"use client";

import React from "react";
import ClusterPage from "../page";

export default function DocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClusterPage>
        {children}
    </ClusterPage>
  );
}
