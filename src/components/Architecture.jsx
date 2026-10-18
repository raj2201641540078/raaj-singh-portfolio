import React from "react";
import {
  FaCloud,
  FaDatabase,
  FaNetworkWired,
  FaServer,
  FaCogs,
  FaLaptopCode,
  FaProjectDiagram,
  FaChartLine,
  FaCodeBranch,
} from "react-icons/fa";

const DiagramCard = ({ title, description, icon, accent }) => (
  <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-cyan-500/10">
    <div className="flex items-center gap-4 mb-4">
      <div className={`p-3 rounded-3xl ${accent} bg-opacity-15`}>{icon}</div>
      <h3 className="text-2xl font-semibold text-white">{title}</h3>
    </div>
    <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
  </div>
);

const SkillBadge = ({ label }) => (
  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 shadow-inner shadow-slate-900/20">
    {label}
  </span>
);

export default function Architecture() {
  return (
    <main className="pt-24 lg:pt-28 min-h-screen bg-gradient-to-b from-[#020617] via-[#0a0f1f] to-[#000D1A]/95 text-white">
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-10">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-500/5 backdrop-blur-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4 max-w-3xl">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Roadmap Architecture</p>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-400">
                  Architecture Progress — FAANG SDE Roadmap Style
                </h1>
                <p className="text-gray-300 text-lg leading-8">
                  A roadmap-inspired architecture view with system design, DSA, Java backend, and cloud architecture diagrams. This page now shows the exact roadmap-style architecture visuals plus the skill maps you need for a strong SDE profile.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <SkillBadge label="System Design" />
                <SkillBadge label="DSA" />
                <SkillBadge label="Java Backend" />
                <SkillBadge label="Cloud" />
                <SkillBadge label="Microservices" />
              </div>
            </div>
          </div>

          <section className="rounded-[2rem] border border-white/10 bg-slate-950/90 shadow-2xl shadow-blue-500/5 overflow-hidden">
            <div className="border-b border-white/10 bg-[#07070e]/90 px-6 py-4 flex items-center gap-3">
              <FaProjectDiagram className="text-cyan-300 w-6 h-6" />
              <div>
                <h2 className="text-xl font-semibold">Live Roadmap Diagram</h2>
                <p className="text-sm text-gray-400">Embedded FAANG SDE roadmap architecture with progressive sections.</p>
              </div>
            </div>
            <div className="bg-[#05060d] p-4">
              <iframe
                src="/faang-sde1-roadmap-2.html"
                title="FAANG SDE Roadmap Architecture"
                className="w-full min-h-[900px] rounded-[1.5rem] border border-white/10 bg-black"
              />
            </div>
          </section>

          <div className="grid gap-8 xl:grid-cols-2">
            <DiagramCard
              title="System Design Architecture"
              description="Learn the flow from clients to gateways, microservices, data stores, caches, and observability. This section shows how your architecture should scale, stay resilient, and remain maintainable."
              icon={<FaNetworkWired className="w-7 h-7 text-cyan-300" />}
              accent="bg-cyan-400/20"
            />
            <DiagramCard
              title="DSA Architecture"
              description="Understand how data structures and algorithms fit into real-world systems. This type of architecture bridges high-level design with efficient code execution, making your roadmap stronger."
              icon={<FaChartLine className="w-7 h-7 text-sky-300" />}
              accent="bg-sky-400/15"
            />
            <DiagramCard
              title="Java Backend Architecture"
              description="Visualise Java server flow from controllers to service layers, repositories, caching, and deployment. This reinforces how backend architecture works in powerful Java-based systems."
              icon={<FaCodeBranch className="w-7 h-7 text-violet-300" />}
              accent="bg-violet-400/15"
            />
            <DiagramCard
              title="Cloud Architecture"
              description="See how load balancers, app servers, containers, storage, and monitoring connect in cloud-native systems. This is the architecture look every modern SDE roadmap should include."
              icon={<FaCloud className="w-7 h-7 text-emerald-300" />}
              accent="bg-emerald-400/10"
            />
          </div>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-500/10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-semibold text-white">Architecture Skills Map</h2>
                <p className="mt-2 text-gray-300 max-w-3xl">
                  These architecture skills mirror the roadmap topics: system design patterns, distributed systems, backend architecture, concurrency, and cloud engineering.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "System Design",
                  "Microservices",
                  "Concurrency",
                  "Caching",
                  "API Design",
                  "Distributed Systems",
                  "Spring Boot",
                  "Kubernetes",
                ].map((skill) => (
                  <SkillBadge key={skill} label={skill} />
                ))}
              </div>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-6">
                <h3 className="text-xl font-semibold text-white mb-3">System Design</h3>
                <ul className="list-disc space-y-2 pl-5 text-gray-300">
                  <li>Traffic routing & service orchestration</li>
                  <li>Data flow, caching, and failure domains</li>
                  <li>Resilience patterns and observability</li>
                </ul>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Java Backend</h3>
                <ul className="list-disc space-y-2 pl-5 text-gray-300">
                  <li>Controller → service → repository separation</li>
                  <li>Threading, async processing, and request handling</li>
                  <li>Database design, caching, and deployment</li>
                </ul>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-6">
                <h3 className="text-xl font-semibold text-white mb-3">DSA Architecture</h3>
                <ul className="list-disc space-y-2 pl-5 text-gray-300">
                  <li>Choose the right data structure for each problem</li>
                  <li>Design algorithms for performance and scale</li>
                  <li>Apply DSA patterns in real backend systems</li>
                </ul>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Cloud Architecture</h3>
                <ul className="list-disc space-y-2 pl-5 text-gray-300">
                  <li>Containerised services and auto-scaling</li>
                  <li>Load balancers, service discovery, and storage</li>
                  <li>Monitoring, logging, and deployment pipelines</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
