import { Spotlight } from "@/components/ui/spotlight";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Vortex } from "@/components/ui/vortex";
import { LampDemo } from "@/components/ui/lamp";
import Link from "next/link";
const Page = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Spotlight Section */}
      <div className="relative overflow-hidden w-full">
        <Spotlight className="absolute inset-0 z-0" fill="white" />
        <div className="relative z-10 flex flex-col items-center justify-center px-6 py-32 text-center">
          <h1 className="text-6xl font-bold tracking-tight md:text-7xl bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Oracyn
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-gray-300">
            Upload any document. Oracyn helps you chat, summarize, and visualize
            everything inside it — instantly.
          </p>
          <div className="mt-10 flex gap-6 flex-wrap justify-center">
            <Link
              href="/upload"
              className="bg-blue-600 px-6 py-3 rounded-lg text-white font-semibold hover:bg-blue-700"
            >
              Upload Document
            </Link>
            <Link
              href="/chat"
              className="border border-white px-6 py-3 rounded-lg text-white hover:bg-white hover:text-black transition"
            >
              Start Chatting
            </Link>
          </div>
        </div>
      </div>

      {/* Animated Vortex Feature Section */}
      <section className="py-32 px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          Why Choose Oracyn?
        </h2>

        <Vortex
          backgroundColor="black"
          baseSpeed={0.15}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">AI Contextual Chat</h3>
              <p className="text-gray-400">
                Talk to your documents — Oracyn fetches answers directly from
                your files.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">
                Visual Intelligence
              </h3>
              <p className="text-gray-400">
                Automatically generate charts, comparisons, and visual
                summaries.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Secure & Fast</h3>
              <p className="text-gray-400">
                Your data stays safe. Oracyn is built for speed and privacy.
              </p>
            </div>
          </div>
        </Vortex>
      </section>

      {/* Scrollable Interaction Preview */}
      <section className="py-32 px-6">
        <ContainerScroll
          titleComponent={
            <h2 className="text-4xl font-bold mb-6 text-center text-white">
              What You Can Do with Oracyn
            </h2>
          }
        >
          <div className="grid gap-4 text-center text-lg text-gray-300">
            <p>Upload PDFs, DOCX, or TXT documents</p>
            <p>Ask anything about their content</p>
            <p>Generate dynamic visualizations and insights</p>
            <p>Collaborate, export, and dive deeper</p>
          </div>
        </ContainerScroll>
      </section>

      {/* Final CTA Lamp Demo */}
      <LampDemo />
    </main>
  );
};

export default Page;
