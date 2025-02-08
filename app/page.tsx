
import NavBar from "../components/navbar";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <div className="md:w-[80%] mx-auto">
      <NavBar />
      <main className="w-full flex items-start justify-center mt-8 px-6 lg:px-20 h-auto">
        {/* hero section */}
        <div className="max-w-4xl text-center space-y-6">
          <h1 className="font-extrabold text-4xl md:text-4xl leading-tight text-gray-900 dark:text-white">
            Streamline Your Documents <br /> Like Never Before
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Secure, fast, and organized—
            <span className="font-semibold text-gray-900 dark:text-white">
              DocX
            </span>{" "}
            helps you collaborate, store, and access your documents anywhere,
            anytime.
          </p>
          {/* cta */}
          <div>
            <Button className="bg-primary dark:bg-background-light dark:text-primary">Get started</Button>
          </div>
        {/* sample */}
        </div>
      </main>
    </div>
  );
}
