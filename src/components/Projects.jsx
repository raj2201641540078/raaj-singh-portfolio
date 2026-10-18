import React from "react";
import { Github, ExternalLink } from "lucide-react";
import Decen from "../assets/images/Decentralized-Storage.png";
import DI from "../assets/images/Discover-India.png";
import Ser from "../assets/images/Server.jpeg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MacOsButtons = () => (
  <div className="flex gap-2 mb-4">
    <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors shadow-md" />
    <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors shadow-md" />
    <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors shadow-md" />
  </div>
);

// "React.js",
//         "Node.js",
//         "Express.js",
//         "MongoDB",
//         "JWT",
//         "Daisy UI",
//         "Judge0",
//         "OpenAI",

const ProjectShowcase = () => {
  const projects = [
    {
      title: "HackForge: Online Coding Platform",
      description:
        "HackForge is an online coding platform where users can solve, test, and evaluate coding problems. It features an AI-powered chatbot acting as a personalized coding mentor, secure authentication with JWT and bcrypt, and role-based access control. The platform combines real-time coding evaluation with modern AI integration for an enhanced developer experience.",
      tags: ["HTML", "Tailwind CSS", "React.js", "Node.js", "Express.js", "MongoDB", "JWT", "Daisy UI", "Judge0", "OpenAI"],
      links: {
        github: "https://github.com/raj2201641540078/HackForge-Coding-Platform",
        demo: "https://hackforge.dev/",
      },
      image: Decen,
      featured: true,
    },
    {
      title: "FinAura: Finance Management System",
      description:
        "FinAura is a finance management system featuring a dashboard for tracking and analyzing financial data. It integrates Inngest to automatically notify users via email when expenditure limits are exceeded, and implements JWT-based authentication with bcrypt for secure user logins.",
      tags: ["HTML", "Tailwind CSS", "React.js", "Node.js", "Express.js", "SupaBase", "JWT", "Daisy UI", "Inngest", "OpenAI"],
      links: {
        github: "https://github.com/raj2201641540078/FinAura-Finance-Management-System",
        demo: "https://fin-aura-finance-management-system.vercel.app/",
      },
      image: Ser,
      featured: true,
    },
    {
      title: "Bibliophile: A Literacy Haven",
      description:
        "Bibliophile is a book enthusiasts' platform where users can connect and explore content. It allows users to create and manage interactive reading lists, while offering secure authentication and personalized book collections powered by MongoDB.",
      tags: ["Web Development", "JavaScript", "UI/UX"],
      links: {
        github: "https://github.com/raj2201641540078/Bibliophile-A-Literacy-Haven",
        demo: "https://github.com/raj2201641540078/Bibliophile-A-Literacy-Haven",
      },
      image: DI,
      featured: true,
    },
  ];

  return (
    <div
      className="pt-40 min-h-screen bg-gradient-to-b from-[#020617] via-[#0a0f1f] to-[#000D1A]/90 p-8 text-slate-100"
    >
      <div className="max-w-7xl mx-auto space-y-14">
        <div className="text-center max-w-5xl mx-auto pb-10">
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-center mb-4 leading-tight md:whitespace-nowrap">
            Projects
          </h2>
          <p className="text-slate-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Explore featured projects built with performance, design, and practical functionality in mind.
          </p>
        </div>

        {projects.map((project, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center group rounded-lg p-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 bg-[length:400%_400%] animate-gradient-xy hover:bg-[length:100%_100%] transition-all duration-700 shadow-lg"
          >
            {/* Image Section */}
            <div className="md:w-1/2 overflow-hidden rounded-lg">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Text Section */}
            <Card className="md:w-1/2 bg-gradient-to-br from-slate-800 to-gray-900 rounded-lg overflow-hidden shadow-md transition-transform duration-500 group-hover:scale-105 group-hover:shadow-2xl p-6">
              <MacOsButtons />

              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-emerald-400 text-sm font-mono mb-2 tracking-wide uppercase">
                      Featured Project
                    </div>
                    <CardTitle className="text-slate-100 text-3xl font-bold">
                      {project.title}
                    </CardTitle>
                  </div>
                  <div className="flex gap-4">
                    <a
                      href={project.links.github}
                      className="text-slate-400 hover:text-emerald-400 transition-all duration-300 transform hover:scale-125"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={22} />
                    </a>
                    <a
                      href={project.links.demo}
                      className="text-slate-400 hover:text-emerald-400 transition-all duration-300 transform hover:scale-125"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={22} />
                    </a>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="mt-4">
                <p className="text-slate-300 mb-6 text-lg leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 text-gray-900 shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};





export default ProjectShowcase;
