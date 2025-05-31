import { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import Link from "next/link";

import useDimensions from "@resume/ui/hooks/use-dimensions";
import cn from "@resume/ui/cn";
import type { ResumeValues } from "utils/validations";
import { stripHtmlTags } from "utils/utils";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export default function Template13({
  resumeData,
  contentRef,
  className,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div
      ref={containerRef}
      className={cn(
        "bg-white text-black h-fit w-full aspect-[210/297]",
        className
      )}
    >
      <div
        className={cn(
          "p-8 grid grid-cols-[1fr_1fr] gap-8",
          !width && "invisible"
        )}
        style={{
          zoom: (1 / 794) * width,
          fontFamily: resumeData.fontStyle,
        }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        <div className="space-y-6">
          {(resumeData.firstName || resumeData.lastName) && (
            <>
              <HeaderSection resumeData={resumeData} />
              <hr className="border-t border-gray-300 my-4" />
            </>
          )}
          {resumeData.summary && (
            <>
              <SummarySection resumeData={resumeData} />
              <hr className="border-t border-gray-300 my-4" />
            </>
          )}
          {(resumeData.workExperiences ?? []).length > 0 && (
            <>
              <WorkExperienceSection resumeData={resumeData} />
              <hr className="border-t border-gray-300 my-4" />
            </>
          )}
          {(resumeData.skillSections?.length ?? 0) > 0 && (
            <SkillsSection resumeData={resumeData} />
          )}
          {(resumeData.educations?.length ?? 0) > 0 && (
            <EducationSection resumeData={resumeData} />
          )}
        </div>
        <div className="space-y-6">
          {(resumeData.projects?.length ?? 0) > 0 && (
            <ProjectsSection resumeData={resumeData} />
          )}
          {(resumeData.certifications?.length ?? 0) > 0 && (
            <CertificationsSection resumeData={resumeData} />
          )}
        </div>
      </div>
    </div>
  );
}

interface ResumeSectionProps {
  resumeData: ResumeValues;
}

function HeaderSection({ resumeData }: ResumeSectionProps) {
  const {
    firstName,
    lastName,
    city,
    country,
    phone,
    email,
    website,
    linkedin,
    github,
  } = resumeData;

  return (
    <header>
      {(firstName || lastName) && (
        <h1 className="text-2xl font-bold mb-2">
          {firstName} {lastName}
        </h1>
      )}
      <div className="space-y-1 text-sm">
        {(city || country) && (
          <p>
            Location: {city}, {country}
          </p>
        )}
        {phone && <p>Mobile: {phone}</p>}
        {email && (
          <p>
            Email:{" "}
            <a
              href={`mailto:${email}`}
              className="text-blue-600 hover:underline"
            >
              {email}
            </a>
          </p>
        )}
        {website && (
          <p>
            Website:{" "}
            <a href={website} className="text-blue-600 hover:underline">
              {website}
            </a>
          </p>
        )}
        {linkedin && (
          <p>
            LinkedIn:{" "}
            <a href={linkedin} className="text-blue-600 hover:underline">
              {linkedin}
            </a>
          </p>
        )}
        {github && (
          <p>
            GitHub:{" "}
            <a href={github} className="text-blue-600 hover:underline">
              {github}
            </a>
          </p>
        )}
      </div>
    </header>
  );
}

function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary } = resumeData;

  return (
    <section>
      <h2 className="font-bold mb-2 uppercase">Professional Summary</h2>
      <div className="text-sm summary-content break-all whitespace-pre-wrap">
        {stripHtmlTags(summary || "")}
      </div>
    </section>
  );
}

function WorkExperienceSection({ resumeData }: ResumeSectionProps) {
  const { workExperiences } = resumeData;

  return (
    <section>
      <h2 className="font-bold mb-2 uppercase">Work Experience</h2>
      {workExperiences?.map((exp, index) => (
        <div key={index} className="mb-4">
          <div className="text-sm font-bold">
            {exp.company} | {exp.position}
          </div>
          <div className="text-sm mb-1">
            {exp.startDate && formatDate(exp.startDate, "MMM yyyy")} –{" "}
            {exp.endDate ? formatDate(exp.endDate, "MMM yyyy") : "Present"} |{" "}
            {resumeData.city}, {resumeData.country}
          </div>
          <ul className="list-disc list-inside text-sm space-y-1">
            {exp.description
              ?.split("\n")
              .map((item, i) => <li key={i}>{item}</li>)}
            <li>Talk about features built and technologies used</li>
          </ul>
        </div>
      ))}
    </section>
  );
}

function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skillSections } = resumeData;
  
  if (!skillSections?.length) return null;

  return (
    <section>
      <h2 className="font-bold mb-2 uppercase">Skills</h2>
      <div className="space-y-4 text-sm">
        {skillSections.map((section, index) => (
          <div key={index}>
            <h3 className="font-bold">{section.name}</h3>
            <p>{section.skills.join(", ")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EducationSection({ resumeData }: ResumeSectionProps) {
  const { educations } = resumeData;

  return (
    <section>
      <h2 className="font-bold mb-2 uppercase">Education</h2>
      {educations?.map((edu, index) => (
        <div key={index} className="text-sm space-y-1">
          <div className="font-bold">{edu.degree}</div>
          <div>
            {edu.school},{" "}
            {edu.startDate && formatDate(edu.startDate, "MMM yyyy")} –{" "}
            {edu.endDate && formatDate(edu.endDate, "MMM yyyy")}
          </div>
          <div>
            GPA: (Only include if higher than 3.5 / 4.0) (Class of honors if
            good)
          </div>
          <div>
            [Other school awards like Dean's List, scholarships, community
            awards, etc.]
          </div>
        </div>
      ))}
    </section>
  );
}

function ProjectsSection({ resumeData }: ResumeSectionProps) {
  const { projects } = resumeData;

  return (
    <section>
      <h2 className="font-bold mb-2 uppercase">Projects</h2>
      {projects?.map((project, index) => (
        <div key={index} className="mb-4">
          <div className="text-sm mb-1">
            Project {String.fromCharCode(65 + index)} (URL to GitHub or end
            product) | Role (if relevant)
          </div>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>
              [Action verb] + what you did + reason, outcome or quantified
              results
            </li>
            <li>Talk about features built and technologies used</li>
          </ul>
        </div>
      ))}
    </section>
  );
}

function CertificationsSection({ resumeData }: ResumeSectionProps) {
  const { certifications } = resumeData;

  return (
    <section>
      <h2 className="font-bold mb-2 uppercase">Certifications</h2>
      <div className="space-y-4">
        {certifications?.map((cert, index) => (
          <div key={index}>
            <div className="text-sm mb-1">
              {cert.name}, {cert.completionDate} | {cert.source}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}