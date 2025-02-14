import {
  Workflow,
  Signature,
  Share,
  Building,
  User,
  Upload,
  Lock,
  ClipboardList,
  Mail,
  Slack,
  Briefcase,
  FileText,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "#", label: "Products" },
  { href: "#", label: "Solutions" },
  { href: "#", label: "Features" },
  { href: "#", label: "Integrations" },
  { href: "#", label: "Pricing" },
];

export const PRODUCTS = [
  {
    name: "DocFlow Automation",
    description: "Simplify document approval workflows with basic automation.",
    icon: <Workflow size={20} />,
  },
  {
    name: "E-Signature",
    description:
      "Sign and verify documents securely with a simple digital signature system.",
    icon: <Signature size={20} />,
  },
  {
    name: "Basic Document Sharing",
    description: "Share documents via links with read-only or editable access.",
    icon: <Share size={20} />,
  },
];

export const SOLUTIONS = [
  {
    name: "Legal Firms",
    description:
      "Store and manage case documents securely with role-based access.",
    icon: <Briefcase size={20} />,
  },
  {
    name: "Small Businesses",
    description: "Track invoices, contracts, and business records easily.",
    icon: <Building size={20} />,
  },
  {
    name: "Freelancers",
    description: "Organize proposals, invoices, and agreements in one place.",
    icon: <User size={20} />,
  },
];

export const FEATURES = [
  {
    name: "Drag-and-Drop Upload",
    description: "Easily upload documents by dragging them into the app.",
    icon: <Upload size={20} />,
  },
  {
    name: "Basic Access Control",
    description: "Set simple read/edit permissions on shared documents.",
    icon: <Lock size={20} />,
  },
  {
    name: "Audit Log",
    description: "Track who accessed and modified documents.",
    icon: <ClipboardList size={20} />,
  },
];

export const INTEGRATIONS = [
  {
    name: "Google Drive",
    description: "Import and export documents from Google Drive.",
    icon: <FileText size={20} />,
  },
  {
    name: "Slack Notifications",
    description: "Receive notifications when documents are approved or signed.",
    icon: <Slack size={20} />,
  },
  {
    name: "Email Alerts",
    description: "Get notified via email for document updates.",
    icon: <Mail size={20} />,
  },
];


export const CLUSTERS = [
  {
      id: 1,
      name: "Project Reports",
      visibility: "public"
  },
  {
      id: 2,
      name: "Marketing Materials",
      visibility: "private"
  },
  {
      id: 3,
      name: "Legal Documents",
      visibility: "public"
  },
  {
      id: 4,
      name: "Client Proposals",
      visibility: "private"
  }
];

export const DOCS = [
  {
      id: 1,
      name: "Business Proposal.pdf",
      type: "pdf",
      logo: "/images/pdf_9496432.png"
  },
  {
      id: 2,
      name: "Marketing Plan.docx",
      type: "docx",
      logo: "/images/Microsoft_Word-Logo.wine.png"
  },
  {
      id: 3,
      name: "Project Overview.pptx",
      type: "pptx",
      logo: "/images/Microsoft_PowerPoint-Logo.wine.png"
  },
  {
      id: 4,
      name: "Financial Report.xlsx",
      type: "xlsx",
      logo: "/images/Microsoft_Excel-Logo.wine.png"
  },
  {
      id: 5,
      name: "User Guide.pdf",
      type: "pdf",
      logo: "/images/pdf_9496432.png"
  }
];
