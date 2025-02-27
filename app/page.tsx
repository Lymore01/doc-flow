"use client";

import { useRouter } from "next/navigation";
import NavBar from "../components/navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  return (
    <div className="md:w-[80%] mx-auto">
      <NavBar />

      <div className="min-h-screen bg-background">
        <section className="w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-24 py-16">
          {/* Left Content */}
          <div className="max-w-2xl text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Organize & Share{" "}
              <span className="text-blue-600">Documents Effortlessly</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Cluster your documents, generate shareable links, and collaborate
              seamlessly—all in one place.
            </p>
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                type="text"
                placeholder="docx.io/johndoe"
                className="w-full md:w-64 px-4 py-3 border rounded-md"
              />
              <Button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:opacity-80">
                Start for Free
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden md:block">
            <Image
              src="/images/output.png"
              alt="Doc Flow Mockup"
              width={600}
              height={400}
              className="object-cover rounded-lg shadow-xl"
            />
          </div>
        </section>

        <section className="text-center py-12 px-8">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              {
                title: "📂 Cluster Your Docs",
                description:
                  "Group related documents into smart clusters for better organization.",
                bg: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-secondary dark:to-gray-900",
              },
              {
                title: "🔗 Generate Shareable Links",
                description:
                  "Instantly create secure links to share document clusters.",
                bg: "bg-gradient-to-br from-gray-50 to-blue-600 dark:from-blue-600/70 dark:to-blue-600/90",
              },
              {
                title: "🚀 Access Anywhere",
                description:
                  "View shared docs from any device, anytime, anywhere.",
                bg: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-secondary dark:to-gray-900",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`cursor-pointer relative p-6 rounded-2xl shadow-xl overflow-hidden border-border dark:border-gray-700 ${item.bg} transition-transform transform hover:scale-[1.02]`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600/30 to-transparent rounded-2xl opacity-20"></div>

                <h3 className="relative text-xl font-semibold text-gray-800 ">
                  {item.title}
                </h3>
                <p className="relative text-gray-600 dark:text-gray-300 mt-2">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <h2 className="text-3xl font-bold text-center">Features</h2>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-8 lg:px-12 py-6">
          {/* Large Feature */}
          <div className="relative col-span-1 flex flex-col items-center bg-secondary dark:bg-gray-800 p-4 rounded-xl shadow-md border-border dark:border-gray-700 hover:scale-[1.02] transition-transform">
            <Image
              src="/images/undraw_resume-folder_hf4p.svg"
              alt="Feature 1"
              width={300}
              height={200}
              className="w-full max-w-[280px] aspect-[4/3] object-cover rounded-lg"
            />
            <h3 className="mt-3 text-lg font-semibold ">
              Smart Clustering
            </h3>
            <p className="text-muted-foreground dark:text-gray-400 text-sm text-center">
              Organize files into AI-powered clusters for quick access.
            </p>
          </div>

          {/* Medium Feature */}
          <div className="relative col-span-1 flex flex-col items-center bg-secondary dark:bg-gray-800 p-4 rounded-xl shadow-md border-border dark:border-gray-700 hover:scale-[1.02] transition-transform">
            <Image
              src="/images/undraw_share-link_jr6w.svg"
              alt="Feature 2"
              width={250}
              height={200}
              className="w-full max-w-[240px] aspect-[3/4] object-cover rounded-lg"
            />
            <h3 className="mt-3 text-lg font-semibold ">
              One-Click Sharing
            </h3>
            <p className="text-muted-foreground dark:text-gray-400 text-sm text-center">
              Generate and copy secure links for instant sharing.
            </p>
          </div>

          {/* Small Feature */}
          <div className="relative col-span-1 flex flex-col items-center bg-secondary dark:bg-gray-800 p-4 rounded-xl shadow-md border-border dark:border-gray-700 hover:scale-[1.02] transition-transform">
            <Image
              src="/images/undraw_secure-login_m11a.svg"
              alt="Feature 3"
              width={250}
              height={150}
              className="w-full max-w-[240px] aspect-[4/3] object-cover rounded-lg"
            />
            <h3 className="mt-3 text-lg font-semibold ">
              Privacy & Security
            </h3>
            <p className="text-muted-foreground dark:text-gray-400 text-sm text-center">
              Your docs are encrypted and securely stored.
            </p>
          </div>
        </section>

        {/* 💡 Why Doc Flow? */}
        <section className="text-center px-4 md:px-8 lg:px-12 py-16">
          <h2 className="text-3xl font-bold">Why Choose Doc Flow?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 bg-secondary rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">🚀 Boost Productivity</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                Spend less time searching for documents and more time getting
                work done.
              </p>
            </div>
            <div className="p-6 bg-secondary rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">💡 Simple & Intuitive</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                No learning curve—just drag, drop, and share.
              </p>
            </div>
          </div>
        </section>

        {/* 🚀 Call to Action */}
        <section className="bg-secondary text-center py-12 rounded-lg mx-6 md:mx-16 lg:mx-24">
          <h2 className="text-3xl font-bold">Start Organizing Today</h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Create document clusters and share in seconds.
          </p>
          <Button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-gray-100">
            Get Started Free
          </Button>
        </section>

        {/* 🔻 Footer */}
        <footer className="text-center text-muted-foreground dark:text-gray-400 py-8">
          <p>© 2025 docX. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
