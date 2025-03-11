// TypeScript types based on Prisma schema

export type User = {
  id: string;
  email: string;
  name: string;
  image?: string;
  createdAt: Date;
  clusters: Cluster[];
  updatedAt: Date;
};

export type Cluster = {
  id: string;
  name: string;
  userId: string;
  user: User;
  documents: Document[];
  link?: Link; 
  createdAt: Date;
  updatedAt: Date;
};

export type Document = {
  id: string;
  name: string;
  type: Type;
  url: string;
  clusterId: string;
  cluster: Cluster;
  createdAt: Date;
  updatedAt: Date;
};

export type Link = {
  id: string;
  url: string;
  clusterId: string;
  cluster: Cluster;
  createdAt: Date;
  updatedAt: Date;
};

export type Type = [
  "pdf",
  "doc",
  "docx",
  "txt",
  "markdown",
  "mdx",
  "csv",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "json",
  "xml",
  "yaml"
];
