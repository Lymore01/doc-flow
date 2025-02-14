import Link from "next/link";

export default function Dashboard(){
    return (
        <div className="p-4">
            <Link href="/dashboard/cluster" className="underline">my clusters</Link>
        </div>
    )
}