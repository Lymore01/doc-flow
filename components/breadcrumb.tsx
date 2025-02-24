import { ChevronRight } from "lucide-react";
import Link from "next/link";

const Breadcrumb = ({ items }: { items: { label: string; href?: string }[] }) => {
  return (
    <nav className="flex items-center gap-2 text-sm ">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="underline hover:text-primary transition text-gray-500">
              {item.label}
            </Link>
          ) : (
            <h1 className="font-semibold text-lg">{item.label}</h1>
          )}
          {index < items.length - 1 && <ChevronRight size={16} />}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
