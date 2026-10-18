import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import IconCloudDemo from "./globe";
import { Code2, Paintbrush, Database, Layout, Cpu, Cloud, FileText, AlertTriangle, ShieldQuestion, Brain, BrainIcon, BrainCircuit, Microchip } from "lucide-react";
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaDocker,
  FaGitAlt,
  FaLinux,
  FaFigma,
  FaAws,
  FaJava,
  FaDatabase,
  FaStar,
  FaVuejs,
  FaGithub,
  FaObjectGroup,
  FaProjectDiagram,
  FaBrain,
  FaCalculator,
  FaQuestion,
  FaRobot,
  FaCogs,
  FaMicrochip,
  FaNetworkWired,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiPostgresql,
  SiMongodb,
  SiGraphql,
  SiJest,
  SiWebpack,
  SiRedux,
  SiFirebase,
  SiVercel,
  SiVite,
  SiExpress,
  SiCplusplus,
  SiC,
  SiPython,
  SiJavascript,
  SiSqlite,
  SiSqlalchemy,
  SiMysql,
  SiThemoviedatabase,
  SiGoogledrive,
  SiGithub,
  SiThealgorithms,
  SiHtml5,
  SiCss3,
  SiReact,
  SiNodedotjs,
  SiBraintree,
  SiWolframmathematica,
  SiPinetwork,
  SiWire,
  SiJetbrains,
  SiVuedotjs,
  SiPeakdesign,
  SiUikit,
  SiOpenai,
  SiCodeship,
  SiMicrobit,
  SiGooglegemini,
  SiLlvm,
  SiLangchain,
  SiInternetcomputer,
  SiMagic,
  
} from "react-icons/si";
import { TbBrandVscode } from "react-icons/tb";
import { BsDatabase, BsFileEarmarkCode, BsGithub, BsGrid1X2 } from "react-icons/bs";
import { MdAnimation, MdClass, MdNumbers, MdSmartToy } from "react-icons/md";
import { FcWorkflow } from "react-icons/fc";

import PropTypes from "prop-types";

const SkillCard = ({ icon: Icon, title, link, provider, skills, color }) => (
  <Card className="group relative overflow-hidden bg-gray-900/80 border-gray-700 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
    {/* Shimmer effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(100,100,255,0.1)] to-transparent group-hover:via-[rgba(100,100,255,0.2)] animate-shimmer"></div>

    <CardContent className="p-6 relative z-10">
      {/* Top Row: Left Icon, Title in center, Right Icon (Alert) */}
      <div className="flex justify-between items-center mb-4">
        {/* Left Icon */}
        <div className={`p-3 rounded-xl bg-gray-800/50 ${color} transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Title in the center */}
        <h3 className="text-xl font-bold text-white text-center flex-1 mr-5" >
          {title}
        </h3>

        {/* Right Icon (Alert) + Link if present */}
        <div className="flex items-center gap-2">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              <SiGoogledrive className="w-5 h-5" />
            </a>
          )}
          {/* <AlertTriangle className="w-6 h-6 text-gray-300" /> */}
        </div>
      </div>

      {/* Provider in center */}
      <h4 className="text-md font-bold text-blue-200 hover:text-blue-300 text-center mb-6 ">
        {provider}
      </h4>

      {/* Skills at the bottom */}
      <div className="flex flex-wrap gap-2 ">
        {skills.map((skill, index) => (
          <Badge
            key={index}
            variant="outline"
            className="group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-1 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
              {skill.icon}
            </span>
            <span className="font-medium">{skill.name}</span>
          </Badge>
        ))}
      </div>
    </CardContent>
  </Card>
);

const SkillsSection = () => {
  const certifications = [
    {
      icon: FileText,
      title: "Introduction To Programming In C",
      link: "https://drive.google.com/file/d/1D_ZJIoGusawt_B4oD-RUFlztRpYUYQ9y/view?usp=sharing",
      provider: "Great Learning",
      color: "text-green-400",
      skills: [
        {
          name: "C",
          icon: <SiC className="w-4 h-4 text-green-400" />,
        },
        {
          name: "DSA",
          icon: <SiThealgorithms className="w-4 h-4 text-green-400" />,
        },
      ],
    },
    {
        icon: FileText,
        title: "Responsive Web Design",
        link: "https://drive.google.com/file/d/1laC-j5aQdZTQQIyra3TdxEBWgNJel-_e/view?usp=sharing",
        provider: "CoderArmy",
        color: "text-green-400",
        skills: [
          {
            name: "HTML",
            icon: <SiHtml5 className="w-4 h-4 text-green-400" />,
          },
          {
            name: "CSS",
            icon: <SiCss3 className="w-4 h-4 text-green-400" />,
          },
          {
            name: "JavaScript",
            icon: <SiJavascript className="w-4 h-4 text-green-400" />,
          },
          {
            name: "Typescript",
            icon: <SiTypescript className="w-4 h-4 text-green-400" />,
          },
          {
            name: "ReactJS",
            icon: <SiReact className="w-4 h-4 text-green-400" />,
          },
          {
            name: "Node.js",
            icon: <SiNodedotjs className="w-4 h-4 text-green-400" />,
          },
        ],
      },
      {
        icon: FileText,
        title: "SQL (Basic)",
        link: "https://drive.google.com/file/d/1OHOYKPn7BCW72KNtBoiDSGo2gYUxboVU/view?usp=sharing",
        provider: "Hackerrank",
        color: "text-green-400",
        skills: [
          {
            name: "SQL",
            icon: <FaDatabase className="w-4 h-4 text-green-400" />,
          },
          {
            name: "MySQL",
            icon: <SiMysql className="w-4 h-4 text-green-400" />,
          },
        ],
      },
      {
        icon: FileText,
        title: "C++ & DSA",
        link: "https://drive.google.com/file/d/1oDXm7peu0JcBF0Bu6JXGtFEZT7y5XHCl/view?usp=sharing",
        provider: "CodeHelp",
        color: "text-green-400",
        skills: [
          {
            name: "C++",
            icon: <SiC className="w-4 h-4 text-green-400" />,
          },
          {
            name: "DSA",
           icon: <SiThealgorithms className="w-4 h-4 text-green-400" />,
          },
        ],
      },
      {
        icon: FileText,
        title: "Python",
        link: "https://drive.google.com/file/d/118eprIcQ8GslPFdT7kW7AVgKNZYv70Dh/view?usp=sharing",
        provider: "OneStop",
        color: "text-green-400",
        skills: [
          {
            name: "Python",
           icon: <SiPython className="w-4 h-4 text-green-400" />,
          },
          {
            name: "Object Oriented Programming",
            icon: <MdClass className="w-4 h-4 text-green-400" />,
          },
        ],
      },
      {
        icon: FileText,
        title: "Full Stack Using Java",
        link: "https://drive.google.com/drive/folders/1oUvwpad0UJc-u6ZWAkP4EB_TJHeAweGY?usp=sharing",
        provider: "Udemy",
        color: "text-green-400",
        skills: [
         {
            name: "JavaScript",
            icon: <SiJavascript className="w-4 h-4 text-green-400" />,
          },
          {
            name: "ReactJS",
            icon: <SiReact className="w-4 h-4 text-green-400" />,
          },
          {
            name: "Spring",
            icon: <MdNumbers className="w-4 h-4 text-green-400" />,
          },
          {
            name: "Spring Boot",
             icon: <SiGraphql className="w-4 h-4 text-[#E10098]" />,
          },
          
        ],
      },
      {
        icon: FileText,
        title: "AWS Cloud practitioner Essentials",
        link: "https://drive.google.com/file/d/1BDfi8V7HIO-3jFg3CjHvUV--SL9-XlhW/view?usp=sharing",
        provider: "AWS",
        color: "text-green-400",
        skills: [
          {
            name: "Cloud Essentials",
            icon: <FaRobot className="w-4 h-4 text-green-400" />,
          },
          {
            name: "AWS Architecture and Well-Architected Framework",
            icon: <SiThealgorithms className="w-4 h-4 text-green-400" />,
          },
          {
            name: "Core AWS Services (EC2, S3, RDS, Lambda)",
            icon: <SiThealgorithms className="w-4 h-4 text-green-400" />,
          },
          {
            name: "Security & Compliance Fundamentals",
            icon: <SiThealgorithms className="w-4 h-4 text-green-400" />,
          },
          // {
          //   name: "Neural Networks",
          //   icon: <BrainCircuit className="w-4 h-4 text-green-400" />,
          // },
          // {
          //   name: "Deep Learning",
          //   icon: <Brain className="w-4 h-4 text-green-400" />,
          // },
        ],
      },
      {
        icon: FileText,
        title: "JavaScript",
        link: "https://drive.google.com/file/d/1aKcqVk8M1w06_L2K5JR-_ogPXSrVMLvL/view?usp=sharing",
        provider: "Infosys Springboard",
        color: "text-green-400",
        skills: [
          {
            name: "Cross-Platform & Versatility",
            icon: <SiPython className="w-4 h-4 text-green-400" />,
          },
          {
            name: "Asynchronous & Event-Driven Nature",
            icon: <MdClass className="w-4 h-4 text-green-400" />,
          },
          {
            name: "DOM Manipulation & Browser APIs",
            icon: <BrainCircuit className="w-4 h-4 text-green-400" />,
          },
          {
            name: "ES6+ Features (Arrow Functions, Modules, Promises)",
            icon: <Brain className="w-4 h-4 text-green-400" />,
          },
        ],
      },
      {
        icon: FileText,
        title: "Agentblazer Champion 2025",
        link: "https://drive.google.com/file/d/1S6gbReEYzf7Jv4w8tMuhOip_-lTKOj0Q/view?usp=sharing",
        provider: "Salesforce Trailhead",
        color: "text-green-400",
        skills: [
          {
            name: "Learned Foundational AI Concepts",
            icon: <SiVuedotjs className="w-4 h-4 text-green-400" />,
          },
          {
            name: "Hands-on Agentforce Experience",
            icon: <SiPeakdesign className="w-4 h-4 text-green-400" />,
          },
          {
            name: "Prompt Engineering Basics for AI Agents",
            icon: <SiUikit className="w-4 h-4 text-green-400" />,
          },
        ],
      },
      {
        icon: FileText,
        title: "Introduction To Generative AI",
        link: "https://drive.google.com/file/d/1rzFAvLzv2NAWiHJfqhW9MzgrtxSBdwgR/view?usp=sharing",
        provider: "Udemy",
        color: "text-green-400",
        skills: [
          {
            name: "Generative AI",
            icon: <Microchip className="w-4 h-4 text-green-400" />,
          },
          {
            name: "Gen AI Tools",
            icon: <SiOpenai className="w-4 h-4 text-green-400" />,
          },
          {
            name: "Gemini AI",
            icon: <SiGooglegemini className="w-4 h-4 text-green-400" />,
          },
        ],
      },
      {
        icon: FileText,
        title: "Introduction To Large Language Models",
        link: "",
        provider: "FreeCodeCamp",
        color: "text-green-400",
        skills: [
          {
            name: "OpenAI",
            icon: <SiOpenai className="w-4 h-4 text-green-400" />,
          },
          {
            name: "LLMs",
            icon: <SiLlvm className="w-4 h-4 text-green-400" />,
          },
          {
            name: "Langchain",
            icon: <SiLangchain className="w-4 h-4 text-green-400" />,
          },
        ],
      },
      
      // {
      //   icon: FileText,
      //   title: "React",
      //   link: "https://drive.google.com/file/d/1WsJkzQQM0e7aaBHKAjZtZuJiHyJ3Xb1M/view?usp=sharing ",
      //   provider: "Scrimba : Cousera",
      //   color: "text-green-400",
      //   skills: [
      //     {
      //       name: "Artificial Intelligence",
      //       icon: <SiMagic className="w-4 h-4 text-green-400" />,
      //     },
      //     {
      //       name: "AI Systems",
      //       icon: <SiInternetcomputer className="w-4 h-4 text-green-400" />,
      //     },
      //     {
      //       name: "Applied AI",
      //       icon: <MdSmartToy className="w-4 h-4 text-green-400" />,
      //     },
      //   ],
      // },
  ];

  return (
    <main
      className="pt-24 lg:pt-20 bg-gradient-to-b from-[#020617] via-[#0a0f1f] to-[#000D1A]/90 text-white min-h-screen"
    >
      <section className="container mx-auto px-4 py-14">
        <div className="flex justify-center items-center ">
          {/* <IconCloudDemo /> */}
        </div>

        {/* Certifications Section */}
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-center pt-10 mb-16">
          Certifications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((certification, index) => (
            <SkillCard
              key={index}
              icon={certification.icon}
              title={certification.title}
              link={certification.link}
              provider={certification.provider}
              skills={certification.skills}
              color={certification.color}
            />
          ))}
        </div>
      </section>

      {/* Shimmer Animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </main>
  );
};

SkillCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  link: PropTypes.string,
  provider: PropTypes.string.isRequired,
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
    })
  ).isRequired,
  color: PropTypes.string.isRequired,
};

export default SkillsSection;
