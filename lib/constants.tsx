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

export const TRACKING_DATA = [
  {
    id: 1,
    email: "john.doe@example.com",
    clicks: 5,
  },
  {
    id: 2,
    email: "jane.smith@example.com",
    clicks: 3,
  },
  {
    id: 3,
    email: "bob.johnson@example.com",
    clicks: 8,
  },
  {
    id: 4,
    email: "alice.brown@example.com",
    clicks: 2,
  },
  {
    id: 5,
    email: "charlie.davis@example.com",
    clicks: 7,
  }
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

const username = "john_doe"; 

export const linksData = [
  {
    id: 1,
    name: "Project Proposal",
    url: `https://docx.io/${username}/project-proposal`,
    cluster: "Work Documents",
    createdAt: new Date("2024-01-10"),
    expiresAt: new Date("2025-01-10"),
    isActive: true,
    clickCount: 120,
    category: "Business",
  },
  {
    id: 2,
    name: "Meeting Notes",
    url: `https://docx.io/${username}/meeting-notes`,
    cluster: "Team Collaboration",
    createdAt: new Date("2024-02-15"),
    isActive: true,
    clickCount: 98,
    category: "Work",
  },
  {
    id: 3,
    name: "Budget Report",
    url: `https://docx.io/${username}/budget-report`,
    cluster: "Finance",
    createdAt: new Date("2024-03-01"),
    isActive: true,
    clickCount: 256,
    category: "Finance",
  },
  {
    id: 4,
    name: "Research Paper",
    url: `https://docx.io/${username}/research-paper`,
    cluster: "Academics",
    createdAt: new Date("2024-04-05"),
    expiresAt: new Date("2025-04-05"),
    isActive: false,
    clickCount: 45,
    category: "Education",
  },
  {
    id: 5,
    name: "Resume",
    url: `https://docx.io/${username}/resume`,
    cluster: "Personal",
    createdAt: new Date("2024-05-20"),
    isActive: true,
    clickCount: 150,
    category: "Career",
  },
  {
    id: 6,
    name: "Marketing Strategy",
    url: `https://docx.io/${username}/marketing-strategy`,
    cluster: "Marketing",
    createdAt: new Date("2024-06-10"),
    expiresAt: new Date("2025-06-10"),
    isActive: true,
    clickCount: 300,
    category: "Business",
  },
  {
    id: 7,
    name: "Thesis Draft",
    url: `https://docx.io/${username}/thesis-draft`,
    cluster: "Academics",
    createdAt: new Date("2024-07-15"),
    expiresAt: new Date("2025-07-15"),
    isActive: true,
    clickCount: 210,
    category: "Education",
  },
  {
    id: 8,
    name: "Design Mockups",
    url: `https://docx.io/${username}/design-mockups`,
    cluster: "Design",
    createdAt: new Date("2024-08-01"),
    isActive: true,
    clickCount: 340,
    category: "Creative",
  },
  {
    id: 9,
    name: "Client Agreement",
    url: `https://docx.io/${username}/client-agreement`,
    cluster: "Legal",
    createdAt: new Date("2024-09-12"),
    expiresAt: new Date("2025-09-12"),
    isActive: false,
    clickCount: 85,
    category: "Business",
  },
  {
    id: 10,
    name: "Technical Documentation",
    url: `https://docx.io/${username}/technical-documentation`,
    cluster: "Development",
    createdAt: new Date("2024-10-05"),
    isActive: true,
    clickCount: 400,
    category: "Software",
  },
];


export const CLUSTER_CATEGORIES = [
  { id: 1, name: "Technology" },
  { id: 2, name: "Education" },
  { id: 3, name: "Health & Wellness" },
  { id: 4, name: "Finance & Business" },
  { id: 5, name: "E-commerce" },
  { id: 6, name: "Entertainment" },
  { id: 7, name: "Travel & Tourism" },
  { id: 8, name: "Food & Beverage" },
  { id: 9, name: "Social Media" },
  { id: 10, name: "Productivity" },
  { id: 11, name: "Government & Politics" },
  { id: 12, name: "Gaming" },
  { id: 13, name: "Cryptocurrency & Blockchain" },
  { id: 14, name: "Automobile" },
  { id: 15, name: "Real Estate" },
  { id: 16, name: "Sports & Fitness" },
  { id: 17, name: "Science & Research" },
  { id: 18, name: "Art & Design" },
  { id: 19, name: "Fashion & Lifestyle" },
  { id: 20, name: "News & Media" },
  { id: 21, name: "Programming & Development" },
  { id: 22, name: "AI & Machine Learning" },
  { id: 23, name: "Cybersecurity" },
  { id: 24, name: "Non-Profit & Charity" },
  { id: 25, name: "Self-Improvement" },
  { id: 26, name: "Parental & Family" },
  { id: 27, name: "Legal & Law" },
  { id: 28, name: "Marketing & Advertising" },
  { id: 29, name: "Music & Audio" },
  { id: 30, name: "Spirituality & Mindfulness" }
];
