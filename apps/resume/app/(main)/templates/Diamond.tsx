import { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import useDimensions from "@resume/ui/hooks/use-dimensions";
import cn from "@resume/ui/cn";
import type { ResumeValues } from "utils/validations";
import { Award, Briefcase, GraduationCap, PuzzleIcon } from "lucide-react";
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

export default function Diamond({
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
        className={cn("flex flex-col", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
          fontFamily: resumeData.fontStyle,
          fontSize: `${primaryFontSize}px`,
        }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        {<HeaderSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />}
        <div className="p-8 space-y-6">
          {resumeData.summary && <SummarySection resumeData={resumeData} secondaryFontSize={secondaryFontSize} />}
          <ExperienceSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
          <EducationSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
          <SkillsSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
          {(resumeData.projects?.length ?? 0) > 0 && (
            <ProjectsSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
          )}
          {(resumeData.certifications?.length ?? 0) > 0 && (
            <CertificationsSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
          )}
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

const DiamondIcon = ({ Icon, primaryColorHex }: { Icon: React.ElementType; primaryColorHex?: string }) => (
  <div className="relative ml-[0.7%]">
    <div 
      className="w-8 h-8 rotate-45 flex items-center justify-center"
      style={{ backgroundColor: primaryColorHex || "#363D49" }}
    >
      <Icon className="w-5 h-5 text-white rotate-[-45deg]" />
    </div>
  </div>
);

function RatingDots({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <div
          key={value}
          className={cn(
            "w-3 h-3 rotate-45",
            value <= rating ? "bg-[#2D3748]" : "border border-[#2D3748]"
          )}
        />
      ))}
    </div>
  );
}

function HeaderSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const { firstName, lastName, jobTitle, phone, email, primaryColorHex } = resumeData;
  return (
    <div className="text-white p-8" style={{ backgroundColor: primaryColorHex || "#363D49" }}>
      <div className="space-y-2">
        {(firstName || lastName) && (
          <h1 className="font-bold" style={{ fontSize: `${Math.round((primaryFontSize || 14) * 2.14)}px` }}>
            {firstName} {lastName}
          </h1>
        )}
        {jobTitle && <p style={{ fontSize: `${Math.round((primaryFontSize || 14) * 1.43)}px` }}>{jobTitle}</p>}
        <div className="grid grid-cols-2 gap-4 mt-4" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
          <div>
            {phone && (
              <p>
                <span className="font-semibold">Phone:</span> {phone}
              </p>
            )}
            {email && (
              <p>
                <span className="font-semibold">E-mail:</span> {email}
              </p>
            )}
          </div>
          {/* {linkedin && (
            <div>
              <p>
                <span className="font-semibold">LinkedIn:</span>{" "}
                linkedin.com/johnuw
              </p>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

function SummarySection({ resumeData, secondaryFontSize }: ResumeSectionProps) {
  return (
    <div className="text-gray-700 break-all whitespace-pre-wrap" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
      <p>{stripHtmlTags(resumeData.summary || "")}</p>
    </div>
  );
}

function ExperienceSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const { workExperiences, primaryColorHex } = resumeData;
  
  if(!workExperiences) return null;
  console.log(workExperiences[0]?.startDate)
  return (
    <section className="relative break-inside-avoid">
      <div className="absolute left-5 top-12 bottom-0 w-[1px] bg-gray-200" />
      <div className="flex items-center gap-3 mb-4">
        <DiamondIcon Icon={Briefcase} primaryColorHex={primaryColorHex} />
        <h2 className="font-bold" style={{ fontSize: `${Math.round((primaryFontSize || 14) * 1.43)}px`, color: primaryColorHex || "#363D49" }}>EXPERIENCE</h2>
      </div>
      <div className="space-y-6 ml-4">
        {workExperiences?.map((exp, index) => (
          <div
            key={index}
            className="flex relative pl-6"
          >
            <div 
              className="absolute left-0 top-2 w-2 h-2 rotate-45"
              style={{ backgroundColor: primaryColorHex || "#363D49" }}
            />
            <div className="w-24 flex-shrink-0 text-gray-600 font-bold" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
              {exp.startDate && formatDate((exp?.startDate), "MMM yyyy")} -{" "}
              {exp.endDate ? formatDate((exp?.endDate), "MMM yyyy") : "present"}
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-800" style={{ fontSize: `${primaryFontSize || 14}px` }}>{exp.position}</div>
              <div className="text-gray-600 mb-2" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{exp.company}</div>
              {exp.description && (
                <ul className="list-disc ml-5 space-y-2 text-gray-700">
                  <div className="break-words whitespace-normal overflow-hidden" style={{ fontSize: `${Math.round((secondaryFontSize || 12) * 0.83)}px` }}>{exp.description}</div>
                </ul>
              )}
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
    <section className="relative">
      <div className="absolute left-5 top-12 bottom-0 w-[1px] bg-gray-200" />
      <div className="flex items-center gap-3 mb-4">
        <DiamondIcon Icon={GraduationCap} primaryColorHex={primaryColorHex} />
        <h2 className="font-bold" style={{ fontSize: `${Math.round((primaryFontSize || 14) * 1.43)}px`, color: primaryColorHex || "#363D49" }}>EDUCATION</h2>
      </div>
      <div className="space-y-6 ml-4">
        {educations?.map((edu, index) => (
          <div
            key={index}
            className="flex relative pl-6"
          >
            <div 
              className="absolute left-0 top-2 w-2 h-2 rotate-45"
              style={{ backgroundColor: primaryColorHex || "#363D49" }}
            />
            <div className="w-24 flex-shrink-0 text-gray-600 font-bold" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
              {edu.startDate && formatDate(edu.startDate, "MMM yyyy")} -{" "}
              {edu.endDate ? formatDate(edu.endDate, "MMM yyyy") : "present"}
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-800" style={{ fontSize: `${primaryFontSize || 14}px` }}>
                {edu.degree}, {edu.school}
              </div>
              <ul className="list-disc ml-5 space-y-2 text-gray-700">
                {edu.description
                  ?.split("\n")
                  .map((item, i) => <li key={i} style={{ fontSize: `${secondaryFontSize || 12}px` }}>{item}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillsSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const { skillSections, primaryColorHex } = resumeData;
  
  if (!skillSections?.length) return null;
  
  return (
    <section className="relative">
      <div className="absolute left-5 top-12 bottom-0 w-[1px] bg-gray-200" />
      <div className="flex items-center gap-3 mb-4">
        <DiamondIcon Icon={PuzzleIcon} primaryColorHex={primaryColorHex} />
        <h2 className="font-bold" style={{ fontSize: `${Math.round((primaryFontSize || 14) * 1.43)}px`, color: primaryColorHex || "#363D49" }}>Skills</h2>
      </div>
      <div className="space-y-3 ml-4">
        {skillSections.map((section, index) => (
          <div
            key={index}
            className="relative pl-6"
          >
            <div 
              className="absolute left-0 top-2 w-2 h-2 rotate-45"
              style={{ backgroundColor: primaryColorHex || "#363D49" }}
            />
            <h3 className="font-bold mb-1" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{section.name}</h3>
            <p className="text-gray-600" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{section.skills.join(", ")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
  const { projects, primaryColorHex } = resumeData;

  return (
    <section className="relative">
      <div className="absolute left-5 top-12 bottom-0 w-[1px] bg-gray-200" />
      <div className="flex items-center gap-3 mb-4">
        <DiamondIcon Icon={Briefcase} primaryColorHex={primaryColorHex} />
        <h2 className="font-bold" style={{ fontSize: `${Math.round((primaryFontSize || 14) * 1.43)}px`, color: primaryColorHex || "#363D49" }}>PROJECTS</h2>
      </div>
      <div className="space-y-6 ml-4">
        {projects?.map((project, index) => (
          <div
            key={index}
            className="flex relative pl-6"
          >
            <div 
              className="absolute left-0 top-2 w-2 h-2 rotate-45"
              style={{ backgroundColor: primaryColorHex || "#363D49" }}
            />
            <div className="w-24 flex-shrink-0 text-gray-600 font-bold" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
              {project.startDate && formatDate(project.startDate, "MMM yyyy")} -{" "}
              {project.endDate ? formatDate(project.endDate, "MMM yyyy") : "present"}
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-800" style={{ fontSize: `${primaryFontSize || 14}px` }}>{project.name}</div>
              <div className="text-gray-600 mb-2" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{project.role}</div>
              {project.description && (
                <div className="text-gray-700 break-words whitespace-normal" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
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

  if (!certifications?.length) return null;

  return (
    <section className="relative">
      <div className="absolute left-5 top-12 bottom-0 w-[1px] bg-gray-200" />
      <div className="flex items-center gap-3 mb-4">
        <DiamondIcon Icon={Award} primaryColorHex={primaryColorHex} />
        <h2 className="font-bold" style={{ fontSize: `${Math.round((primaryFontSize || 14) * 1.43)}px`, color: primaryColorHex || "#363D49" }}>CERTIFICATIONS</h2>
      </div>
      <div className="space-y-3 ml-4">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="relative pl-6"
          >
            <div 
              className="absolute left-0 top-2 w-2 h-2 rotate-45"
              style={{ backgroundColor: primaryColorHex || "#363D49" }}
            />
            <div className="flex justify-between">
              <p className="font-bold" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{cert.name}</p>
              <p className="text-gray-600" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
                {cert.completionDate && formatDate(cert.completionDate, "MMM yyyy")}
              </p>
            </div>
            {cert.source && (
              <p className="text-gray-500" style={{ fontSize: `${Math.round((secondaryFontSize || 12) * 0.83)}px` }}>{cert.source}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}