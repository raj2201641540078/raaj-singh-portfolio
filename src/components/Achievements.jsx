import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import IconCloudDemo from "./globe";
import { Code2, Paintbrush, Database, Layout, Cpu, Cloud, Award, FileText } from "lucide-react";
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
  SiGithub, // Added for Google Drive icon
} from "react-icons/si";
import { TbBrandVscode } from "react-icons/tb";
import { BsDatabase, BsFileEarmarkCode, BsGithub, BsGrid1X2 } from "react-icons/bs";
import { MdAnimation } from "react-icons/md";
import { FcWorkflow } from "react-icons/fc";

const SkillCard = ({ icon: Icon, title, provider, skills, color }) => (
  <Card className="group relative overflow-hidden bg-gray-900/80 border-gray-700 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(100,100,255,0.1)] to-transparent group-hover:via-[rgba(100,100,255,0.2)] animate-shimmer"></div>
    <CardContent className="p-6 relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`p-3 rounded-xl bg-gray-800/50 ${color} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          {title}
        </h3>
        
        <h4 className="text-1xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
          {provider}
        </h4>
        </div>
      
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge
            key={index}
            variant="outline"
            className="group/badge relative bg-gray-800/50 hover:bg-gray-700/80 text-gray-100 border-gray-600 flex items-center gap-2 py-2 px-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <span className="transform group-hover/badge:scale-110 transition-transform duration-300">
              {skill.icon}
            </span>
            <span className="font-medium">{skill.name}</span>
            {skill.link && (
              <a
                href={skill.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm ml-2"
              >
                <SiGoogledrive className="w-4 h-4" /> {/* Using Google Drive icon */}
              </a>
            )}
          </Badge>
        ))}
      </div>
    </CardContent>
  </Card>
);

const SkillsSection = () => {
  

  const achievements = [
    {
      icon: Award,
      title: "Technical Co-Head",
      color: "text-blue-400",
      skills: [
        {
          name: "Led CS Department In Ignitia'24 [Techno-Cultural Fest]",
          icon: <Award className="w-4 h-4 text-orange-400" />,
          link: "https://drive.google.com/file/d/1Uuw8N0SuntSNx8blpuT3jX2qnJKOJh5h/view?usp=sharing",
        },
        
      ],
    },
    {
      icon: Award,
      title: "Institute Rank 139",
      color: "text-blue-400",
      skills: [
        {
          name: "GeeksforGeeks Rating 1200+ & 500+ Problems Solved",
          icon: <Award className="w-4 h-4 text-orange-400" />,
          link: "https://www.geeksforgeeks.org/profile/2k22psitc7ofz?tab=activity",
        },
      ],
    },
    {
      icon: SiGithub,
      title: "Open Source Contributer",
      color: "text-blue-400",
      skills: [
        {
          name: "@Hacktoberfest 2025 by Digital Ocean",
          icon: <Award className="w-4 h-4 text-orange-400" />,
          link: "https://www.holopin.io/@raj2201641540078#badges",
        },
      ],
    },
    {
      icon: Award,
      title: "Team Lead - MERN Project",
      color: "text-blue-400",
      skills: [
        {
          name: "Successfully led a 5-member team",
          icon: <Award className="w-4 h-4 text-orange-400" />,
          link: "https://github.com/raj2201641540078/FinAura-Finance-Management-System",
        },
      ],
    },
    {
      icon: Award,
      title: "Global Rank 613,110",
      color: "text-blue-400",
      skills: [
        {
          name: "LeetCode Weekly Contest 1,415 & Max Rating Of 1607",
          icon: <Award className="w-4 h-4 text-orange-400" />,
          link: "https://leetcode.com/u/DS1B_2201641540078/",
        },
      ],
    },
    {
      icon: Award,
      title: (<>5 <FaStar className="inline text-orange-400" /> Problem Solver & C++ Programmer</>),
      color: "text-blue-400",
      skills: [
        {
          name: "Hackerrank",
          icon: <Award className="w-4 h-4 text-orange-400" />,
          link: "https://www.hackerrank.com/profile/2k22_psit_csds_1",
        },
      ],
    },
    {
      icon: Award,
      title: "Google Gen AI Study Sept 2025",
      color: "text-blue-400",
      skills: [
        {
          name: "Certified by Oracle University for excellence in Generative AI fundamentals and applied practices.",
          icon: <Award className="w-4 h-4 text-orange-400" />,
          link: "",
        },
      ],
    },
    // {
    //   icon: Award,
    //   title: "Google Gen AI Study Jam 2024",
    //   color: "text-blue-400",
    //   skills: [
    //     {
    //       name: "Google Developers Groups on Campus",
    //       icon: <Award className="w-4 h-4 text-orange-400" />,
    //       link: "https://drive.google.com/file/d/1e6RPcaT-BtUj2AKRatUaCNT_wwDeS2E7/view?usp=sharing",
    //     },
    //   ],
    // },
    // {
    //   icon: FaVuejs,
    //   title: "NASA Space Apps Challenge",
    //   color: "text-blue-400",
    //   skills: [
    //     {
    //       name: "Led team 'Virus', selected among the top 4 teams (from 200 state-level participants) for Phase 2, earning the 'Galactic Problem Solver' certification (organized by Hack2Skill). ",
    //       icon: <Award className="w-4 h-4 text-orange-400" />,
    //       link: "https://drive.google.com/file/d/1DWmtZ50XUtybvtMngb0LdYqj8IJTo7o4/view?usp=sharing",
    //     },
    //   ],
    // },
    // {
    //   icon: SiGithub,
    //   title: "Open Source Contributer",
    //   color: "text-blue-400",
    //   skills: [
    //     {
    //       name: "@Hacktoberfest 2025 by Digital Ocean",
    //       icon: <Award className="w-4 h-4 text-orange-400" />,
    //       link: "https://www.holopin.io/@raj2201641540078#badges",
    //     },
    //   ],
    // },
  ];

  // const certifications = [
  //   {
  //     icon: FileText,
  //     title: "Introduction To Programming In C",
  //     provider: "NPTEL",
  //     color: "text-green-400",
  //     skills: [
  //       {
  //         name: "AWS Certified Developer",
  //         icon: <SiC className="w-4 h-4 text-green-400" />,
  //         link: "https://example.com/aws-certificate",
  //       },
  //     ],
  //   },
  // ];

  return (
    <main
      className="pt-15 lg:pt-0 bg-gradient-to-b from-[#020617] via-[#0a0f1f] to-[#000D1A]/90 text-white min-h-screen"
    >
      <section className="container mx-auto px-4 py-11">
        <div className="flex justify-center items-center ">
          {/* <IconCloudDemo /> */}
        </div>

        {/* Achievements Section */}
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-center pt-16 mb-10">
          Achievements & Extarcurricular
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {achievements.map((achievement, index) => (
            <SkillCard
              key={index}
              icon={achievement.icon}
              title={achievement.title}
              skills={achievement.skills}
              color={achievement.color}
            />
          ))}
        </div>

        {/* Certifications Section
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-center pt-8 mb-10">
          Certifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((certification, index) => (
            <SkillCard
              key={index}
              icon={certification.icon}
              title={certification.title}
              provider={certification.provider}
              skills={certification.skills}
              color={certification.color}
            />
          ))}
        </div> */}
      </section>
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

export default SkillsSection;