import { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import useDimensions from "@resume/ui/hooks/use-dimensions";
import cn from "@resume/ui/cn";
import type { ResumeValues } from "utils/validations";
import { Award, Briefcase, GraduationCap, User } from "lucide-react";
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

export default function Vibes({
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
        className={cn("p-8", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
          fontFamily: resumeData.fontStyle,
          fontSize: `${primaryFontSize}px`,
        }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        <HeaderSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
        <div className="grid grid-cols-[2fr_1fr] gap-8 mt-6">
          <div className="space-y-6">
            <ExperienceSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
            {(resumeData.projects?.length ?? 0) > 0 && (
              <ProjectsSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
            )}
            <EducationSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
          </div>
          <div className="space-y-6">
            <PersonalInfoSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
            <SkillsSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
            {(resumeData.certifications?.length ?? 0) > 0 && (
              <CertificationsSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
            )}
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
      className="w-6 h-6 flex items-center justify-center"
      style={{ backgroundColor: primaryColorHex || "#113A58" }}
    >
      <Icon className="w-4 h-4 text-white" />
    </div>
  );
}

function HeaderSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const {
    firstName,
    lastName,
    jobTitle,
    summary,
    primaryColorHex
  } = resumeData;

  return (
    <div className="space-y-4">
      <h1 className="font-bold" style={{ fontSize: `${Math.round((primaryFontSize || 14) * 2.14)}px`, color: primaryColorHex || "#113A58" }}>{firstName} {lastName}</h1>
      <h2 style={{ fontSize: `${Math.round((primaryFontSize || 14) * 1.43)}px`, color: primaryColorHex || "#113A58" }}>{jobTitle}</h2>
      <p className="text-gray-700 break-all whitespace-pre-line" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
        {stripHtmlTags(summary || "")}
      </p>
    </div>
  );
}

function ExperienceSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const { workExperiences, primaryColorHex } = resumeData;

  if(!workExperiences) return;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3 border-b border-gray-300">
        <SectionIcon icon={Briefcase} primaryColorHex={primaryColorHex} />
        <h2 className="font-bold" style={{ fontSize: `${Math.round((primaryFontSize || 14) * 1.29)}px` }}>Experience</h2>
      </div>
      <div className="space-y-6">
        {resumeData.workExperiences?.map((exp, index) => (
          <div key={index} className="flex">
            <div className="w-24 flex-shrink-0 text-gray-600 font-bold" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
              {exp.startDate && formatDate(exp.startDate, "yyyy-MM")} -{" "}
              {exp.endDate ? formatDate(exp.endDate, "yyyy-MM") : "present"}
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-800" style={{ fontSize: `${primaryFontSize || 14}px` }}>{exp.position}</div>
              <div className="text-gray-600 mb-2" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{exp.company}</div>
              <ul className="list-disc ml-5 space-y-2 text-gray-700 break-all whitespace-pre-wrap" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
                {exp.description
                  ?.split("\n")
                  .map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EducationSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const { educations, primaryColorHex } = resumeData;

  const educationsNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!educationsNotEmpty?.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3 border-b border-gray-300">
        <SectionIcon icon={GraduationCap} primaryColorHex={primaryColorHex} />
        <h2 className="font-bold" style={{ fontSize: `${Math.round((primaryFontSize || 14) * 1.29)}px` }}>Education</h2>
      </div>
      {resumeData.educations?.map((edu, index) => (
        <div key={index} className="flex">
          <div className="w-24 flex-shrink-0 text-gray-600 font-bold" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
            {edu.startDate && formatDate(edu.startDate, "yyyy-MM")} -{" "}
            {edu.endDate ? formatDate(edu.endDate, "yyyy-MM") : "present"}
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-800" style={{ fontSize: `${primaryFontSize || 14}px` }}>{edu.school}</div>
            <div className="text-gray-600 mb-2" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{edu.degree}</div>
            <ul className="list-disc ml-5 space-y-2 text-gray-700">
              {edu.description
                ?.split("\n")
                .map((item, i) => <li key={i} className="break-all whitespace-pre-wrap" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{item}</li>)}
            </ul>
          </div>
        </div>
      ))}
    </section>
  );
}

function PersonalInfoSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const {
    city,
    country,
    phone,
    email,
    primaryColorHex
  } = resumeData;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3 border-b border-gray-300">
        <SectionIcon icon={User} primaryColorHex={primaryColorHex} />
        <h2 className="font-bold" style={{ fontSize: `${Math.round((primaryFontSize || 14) * 1.29)}px` }}>Personal Info</h2>
      </div>
      <div className="space-y-4">
          {(city || country)&&(
            <div>
            <h3 className="font-bold mb-1" style={{ fontSize: `${secondaryFontSize || 12}px` }}>Address</h3>
          <p className="text-gray-600" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
            {city} {country}
          </p>
        </div>
          )}
          {phone&&(
        <div>
          <h3 className="font-bold mb-1" style={{ fontSize: `${secondaryFontSize || 12}px` }}>Phone</h3>
          <p className="text-gray-600" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{phone}</p>
        </div>
          )}
          {email &&(
        <div>
          <h3 className="font-bold mb-1" style={{ fontSize: `${secondaryFontSize || 12}px` }}>E-mail</h3>
          <p className="text-gray-600" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{email}</p>
        </div>
          )}
        <div>
          <h3 className="font-bold mb-1" style={{ fontSize: `${secondaryFontSize || 12}px` }}>LinkedIn</h3>
          <p className="text-gray-600" style={{ fontSize: `${secondaryFontSize || 12}px` }}>linkedin.com/johniw</p>
        </div>
      </div>
    </section>
  );
}

function SkillsSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const { skillSections, primaryColorHex } = resumeData;

  if (!skillSections?.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3 border-b border-gray-300">
        <SectionIcon icon={Award} primaryColorHex={primaryColorHex} />
        <h2 className="font-bold" style={{ fontSize: `${Math.round((primaryFontSize || 14) * 1.29)}px` }}>Skills</h2>
      </div>
      <div className="space-y-4">
        {skillSections.map((section, index) => (
          <div key={index}>
            <h3 className="font-bold text-gray-800 mb-2" style={{ fontSize: `${primaryFontSize || 14}px` }}>{section.name}</h3>
            <ul className="space-y-1">
              {section.skills.map((skill, skillIndex) => (
                <li key={skillIndex} style={{ fontSize: `${secondaryFontSize || 12}px` }}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const { projects, primaryColorHex } = resumeData;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3 border-b border-gray-300">
        <SectionIcon icon={Briefcase} primaryColorHex={primaryColorHex} />
        <h2 className="font-bold" style={{ fontSize: `${Math.round((primaryFontSize || 14) * 1.29)}px` }}>Projects</h2>
      </div>
      <div className="space-y-6">
        {projects?.map((project, index) => (
          <div key={index} className="flex">
            <div className="w-24 flex-shrink-0 text-gray-600 font-bold" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
              {project.startDate && formatDate(project.startDate, "yyyy-MM")} -{" "}
              {project.endDate ? formatDate(project.endDate, "yyyy-MM") : "present"}
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-800" style={{ fontSize: `${primaryFontSize || 14}px` }}>{project.name}</div>
              <div className="text-gray-600 mb-2" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{project.role}</div>
              {project.description && (
                <div className="text-gray-700 break-all whitespace-pre-wrap" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
                  {project.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CertificationsSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const { certifications, primaryColorHex } = resumeData;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3 border-b border-gray-300">
        <SectionIcon icon={Award} primaryColorHex={primaryColorHex} />
        <h2 className="font-bold" style={{ fontSize: `${Math.round((primaryFontSize || 14) * 1.29)}px` }}>Certifications</h2>
      </div>
      <div className="space-y-3">
        {certifications?.map((cert, index) => (
          <div key={index}>
            <div className="font-bold text-gray-800" style={{ fontSize: `${primaryFontSize || 14}px` }}>{cert.name}</div>
            <div className="text-gray-600" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{cert.source}</div>
            {cert.completionDate && (
              <div className="text-gray-500" style={{ fontSize: `${Math.round((secondaryFontSize || 12) * 0.83)}px` }}>
                {formatDate(cert.completionDate, "yyyy-MM")}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
} 