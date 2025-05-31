import { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Briefcase,
  GraduationCap,
  Book,
  Globe2,
  Award,
  Heart,
} from "lucide-react";
import useDimensions from "@resume/ui/hooks/use-dimensions";
import cn from "@resume/ui/cn";
import type { ResumeValues } from "utils/validations";
import { stripHtmlTags } from "utils/utils";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

// Helper function to convert font size strings to pixel values
const getFontSizeInPx = (size: string | undefined): number => {
  switch (size) {
    case "small": return 12;
    case "medium": return 14;
    case "large": return 16;
    default: return 14;
  }
};

export default function IT({
  resumeData,
  contentRef,
  className,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  const primaryFontSize = getFontSizeInPx(resumeData.primaryFontSize);
  const secondaryFontSize = getFontSizeInPx(resumeData.secondaryFontSize);

  return (
    <div
      ref={containerRef}
      className={cn(
        "bg-white text-black h-fit w-full aspect-[210/297]",
        className
      )}
    >
      <div
        className={cn("", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
          fontFamily: resumeData.fontStyle,
          fontSize: `${primaryFontSize}px`,
        }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        <HeaderSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
        <ContactSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
        <div className="grid grid-cols-[1.6fr_1fr] gap-8 p-8">
          <div className="space-y-8">
            <WorkExperienceSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
            {/* <VolunteerSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} /> */}
            {(resumeData.projects?.length ?? 0) > 0 && (
              <ProjectsSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
            )}
            <EducationSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
          </div>
          <div className="bg-gray-100 p-6 rounded space-y-8">
            <ExpertiseSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
            {(resumeData.certifications?.length ?? 0) > 0 && (
              <CertificationsSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
            )}
            
            {/* {(resumeData.courses?.length ?? 0) > 0 && (
              <CoursesSection resumeData={resumeData} />
            )}
            {(resumeData.languages?.length ?? 0) > 0 && (
              <LanguagesSection resumeData={resumeData} />
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ResumeSectionProps {
  resumeData: ResumeValues;
  primaryFontSize?: number;
  secondaryFontSize?: number;
}

function SectionIcon({ icon: Icon, primaryColorHex }: { icon: any; primaryColorHex?: string }) {
  return (
    <div 
      className="w-8 h-8 rounded-full flex items-center justify-center"
      style={{ backgroundColor: primaryColorHex || "#2F3C43" }}
    >
      <Icon className="w-6 h-6 text-white" />
    </div>
  );
}

function HeaderSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const { firstName, lastName, jobTitle, primaryColorHex,secondaryColorHex } = resumeData;

  if(!firstName && !lastName && !jobTitle) return; 

  return (
    <header className="p-8 pb-0">
      <h1
        className="text-gray-800 mb-2"
        style={{ fontSize: `${Math.round((primaryFontSize || 14) * 2.86)}px` }}
      >
        {firstName} {lastName}
      </h1>
      <h2
        style={{
          fontSize: `${Math.round((primaryFontSize || 14) * 1.43)}px`,
          color: secondaryColorHex || "#28B4A3",
        }}
      >
        {jobTitle}
      </h2>
    </header>
  );
}

function ContactSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const { email, phone, city, summary, country, primaryColorHex,secondaryColorHex } = resumeData;

  if(!(email && phone && city && summary && country)) return;

  return (
    <div className="space-y-0 p-2">
      {summary && (
        <div
          className="text-white p-4 rounded-lg rounded-b-none"
          style={{
            backgroundColor: primaryColorHex || "#2F3C43",
            fontSize: `${secondaryFontSize || 12}px`,
          }}
        >
          <p className="leading-relaxed break-all whitespace-pre-wrap">
            {stripHtmlTags(summary || "")}
          </p>
        </div>
      )}
      <div
        className="text-white mt-6 p-4 flex items-center justify-center gap-8 rounded-b-lg"
        style={{
          backgroundColor: secondaryColorHex || "#28B4A3",
          fontSize: `${secondaryFontSize || 12}px`,
        }}
      >
        {email && (
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-300 fill-white" />
            <span>{email}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 fill-white text-gray-200" />
            <span>{phone}</span>
          </div>
        )}
        {(city || country) && (
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 fill-white text-gray-200" />
            <span>
              {city}, {country}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function WorkExperienceSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const { workExperiences, primaryColorHex,secondaryColorHex } = resumeData;

  if(!workExperiences) return;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <SectionIcon icon={Briefcase} primaryColorHex={primaryColorHex} />
        <h2
          className="font-bold"
          style={{
            fontSize: `${Math.round((primaryFontSize || 14) * 1.43)}px`,
          }}
        >
          WORK EXPERIENCE
        </h2>
      </div>
      {resumeData.workExperiences?.map((exp, index) => (
        <div key={index} className="mb-6">
          <h3
            className="font-bold"
            style={{
              fontSize: `${Math.round((primaryFontSize || 14) * 1.29)}px`,
            }}
          >
            {exp.position}
          </h3>
          <div
            className="font-medium mb-1"
            style={{
              fontSize: `${Math.round((primaryFontSize || 14) * 1.29)}px`,
            }}
          >
            {exp.company}
          </div>
          <div
            className="flex justify-between mb-2 italic"
            style={{
              fontSize: `${secondaryFontSize || 12}px`,
              color: secondaryColorHex || "#28B4A3",
            }}
          >
            <span>
              {exp.startDate && formatDate(exp.startDate, "MMMM yyyy")} -{" "}
              {exp.endDate ? formatDate(exp.endDate, "MMMM yyyy") : "Present"}
            </span>
            <span>
              {resumeData.city}, {resumeData.country}
            </span>
          </div>
          <ul
            className="list-disc list-inside space-y-2 text-gray-600 break-all whitespace-pre-wrap"
            style={{ fontSize: `${secondaryFontSize || 12}px` }}
          >
            <style jsx>{`
              ul li::marker {
                color: ${secondaryColorHex || "#28B4A3"};
              }
            `}</style>
            {exp.description?.split("\n").map((item, i) => (
              <li key={i}>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

// function VolunteerSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
//   const { primaryColorHex, } = resumeData;
//   return (
//     <section>
//       <div className="flex items-center gap-2 mb-6">
//         <SectionIcon icon={Heart} primaryColorHex={primaryColorHex} />
//         <h2 className="font-bold" style={{ fontSize: `${Math.round((primaryFontSize || 14) * 1.43)}px` }}>VOLUNTEER EXPERIENCE</h2>
//       </div>
//       <div className="mb-6">
//         <h3 className="font-bold" style={{ fontSize: `${Math.round((primaryFontSize || 14) * 1.29)}px` }}>Media Manager</h3>
//         <div className="font-medium mb-1" style={{ fontSize: `${primaryFontSize || 14}px`, color: primaryColorHex || "#28B4A3" }}>Meals on Wheels</div>
//         <div className="flex justify-between text-gray-600 mb-2" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
//           <span>2019 - Present</span>
//           <span>San Francisco, CA</span>
//         </div>
//         <ul className="space-y-2 text-gray-600" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
//           <li className="flex items-start gap-2">
//             <span style={{ color: primaryColorHex || "#28B4A3" }} className="mt-1.5">•</span>
//             <span>
//               Hold a volunteer position as a Media Manager, developing &
//               implementing all targeted content for various media platforms.
//             </span>
//           </li>
//         </ul>
//       </div>
//     </section>
//   );
// }

function EducationSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const { educations, primaryColorHex,secondaryColorHex } = resumeData;

  const educationsNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!educationsNotEmpty?.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <SectionIcon icon={GraduationCap} primaryColorHex={primaryColorHex} />
        <h2
          className="font-bold"
          style={{
            fontSize: `${Math.round((primaryFontSize || 14) * 1.43)}px`,
          }}
        >
          EDUCATION
        </h2>
      </div>
      {educations?.map((edu, index) => (
        <div key={index}>
          <h3
            className="font-bold text-gray-800"
            style={{ fontSize: `${primaryFontSize || 14}px` }}
          >
            {edu.school}
          </h3>
          <p
            className="text-gray-700"
            style={{ fontSize: `${secondaryFontSize || 12}px` }}
          >
            {edu.degree}
          </p>
          <p
            className="text-gray-600 italic"
            style={{
              fontSize: `${secondaryFontSize || 12}px`,
              color: secondaryColorHex || "#28B4A3",
            }}
          >
            {edu.startDate && formatDate(edu.startDate, "MMMM yyyy")} -{" "}
            {edu.endDate ? formatDate(edu.endDate, "MMMM yyyy") : "Present"}
          </p>
        </div>
      ))}
    </section>
  );
}

function ExpertiseSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const { skillSections, primaryColorHex } = resumeData;

  if (!skillSections?.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <SectionIcon icon={Award} primaryColorHex={primaryColorHex} />
        <h2 className="font-bold" style={{ fontSize: `${Math.round((primaryFontSize || 14) * 1.43)}px` }}>AREAS OF EXPERTISE</h2>
      </div>
      <div className="space-y-4">
        {skillSections.map((section, index) => (
          <div key={index}>
            <h3 className="font-bold text-gray-800 mb-2" style={{ fontSize: `${primaryFontSize || 14}px` }}>{section.name}</h3>
            <ul className="space-y-1">
              {section.skills.map((skill, skillIndex) => (
                <li key={skillIndex} className="text-gray-700" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const { projects, primaryColorHex,secondaryColorHex } = resumeData;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <SectionIcon icon={Briefcase} primaryColorHex={primaryColorHex} />
        <h2
          className="font-bold"
          style={{
            fontSize: `${Math.round((primaryFontSize || 14) * 1.43)}px`,
          }}
        >
          PROJECTS
        </h2>
      </div>
      {projects?.map((project, index) => (
        <div key={index} className="mb-6">
          <h3
            className="font-bold"
            style={{
              fontSize: `${Math.round((primaryFontSize || 14) * 1.29)}px`,
            }}
          >
            {project.name}
          </h3>
          <div
            className="font-medium mb-1"
            style={{
              fontSize: `${Math.round((primaryFontSize || 14) * 1.29)}px`,
            }}
          >
            {project.role}
          </div>
          <div
            className="mb-2 italic"
            style={{
              fontSize: `${secondaryFontSize || 12}px`,
              color: secondaryColorHex || "#28B4A3",
            }}
          >
            {project.startDate && formatDate(project.startDate, "MMMM yyyy")} -{" "}
            {project.endDate
              ? formatDate(project.endDate, "MMMM yyyy")
              : "Present"}
          </div>
          {project.description && (
            <div
              className="text-gray-600 break-all whitespace-pre-wrap"
              style={{ fontSize: `${secondaryFontSize || 12}px` }}
            >
              {project.description}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

function CertificationsSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const { certifications, primaryColorHex,secondaryColorHex } = resumeData;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <SectionIcon icon={Award} primaryColorHex={primaryColorHex} />
        <h2
          className="font-bold"
          style={{
            fontSize: `${Math.round((primaryFontSize || 14) * 1.43)}px`,
          }}
        >
          CERTIFICATIONS
        </h2>
      </div>
      <div className="space-y-3">
        {certifications?.map((cert, index) => (
          <div key={index}>
            <div
              className="font-medium"
              style={{
                fontSize: `${primaryFontSize || 14}px`,
                color: secondaryColorHex || "#28B4A3",
              }}
            >
              {cert.name}
            </div>
            <div
              className="text-gray-600 italic"
              style={{ fontSize: `${secondaryFontSize || 12}px` }}
            >
              {cert.source}
            </div>
            {cert.completionDate && (
              <div
                className="text-gray-500"
                style={{
                  fontSize: `${Math.round((secondaryFontSize || 12) * 0.83)}px`,
                }}
              >
                {formatDate(cert.completionDate, "MMMM yyyy")}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// function CoursesSection({ resumeData }: ResumeSectionProps) {
//   const courses = [
//     {
//       name: "Content Marketing, SEO and PPC (2019)",
//       organization: "SEMRUSH Academy",
//     },
//     {
//       name: "Inbound Marketing & Contextual Marketing (2018)",
//       organization: "HubSpot",
//     },
//     {
//       name: "Email Marketing & Sales Funnels (2018)",
//       organization: "ClickMinded Digital Marketing",
//     },
//     {
//       name: "Google Digital Marketing Courses (2017)",
//       organization: "Digital Garage",
//     },
//   ];
//   return (
//     <section>
//       <div className="flex items-center gap-2 mb-6">
//         <SectionIcon icon={Book} />
//         <h2 className="text-xl font-bold">COURSE & TRAINING</h2>
//       </div>
//       <div className="space-y-3">
//         {courses.map((course, index) => (
//           <div key={index}>
//             <div className="font-medium text-[#40C4AA]">{course.name}</div>
//             <div className="text-sm text-gray-600 italic">
//               {course.organization}
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// function LanguagesSection({ resumeData }: ResumeSectionProps) {
//   const languages = [
//     { name: "English", level: "Native or Bilingual Proficiency" },
//     { name: "Spanish", level: "Full Professional Proficiency" },
//     { name: "Mandarin", level: "Limited Working Proficiency" },
//   ];
//   return (
//     <section>
//       <div className="flex items-center gap-2 mb-6">
//         <SectionIcon icon={Globe2} />
//         <h2 className="text-xl font-bold">LANGUAGES</h2>
//       </div>
//       <div className="space-y-3">
//         {languages.map((lang, index) => (
//           <div key={index}>
//             <div className="font-medium">{lang.name}</div>
//             <div className="text-sm text-[#40C4AA]">{lang.level}</div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }