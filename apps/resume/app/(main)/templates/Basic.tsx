import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";

import useDimensions from "@resume/ui/hooks/use-dimensions";

import cn from "@resume/ui/cn";
import { ResumeValues } from "utils/validations"
import { Badge } from "@resume/ui/badge";
import { BorderStyles } from "../../(main)/editor/BorderStyleButton";
import { stripHtmlTags } from "utils/utils";

interface ResumePreviewProps {
    resumeData: ResumeValues;
    contentRef?: React.Ref<HTMLDivElement>;
    className?: string;
}

interface ResumeSectionProps {
    resumeData: ResumeValues;
    primaryFontSize?: number;
    secondaryFontSize?: number;
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

export default function Basic({
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
        className={cn(
          "aspect-[210/297] h-fit w-full bg-white text-black",
          className,
        )}
        ref={containerRef}
      >
        <div
          className={cn("space-y-6 p-6", !width && "invisible")}
          style={{
            zoom: (1 / 794) * width,
            fontFamily: resumeData.fontStyle,
            fontSize: `${primaryFontSize}px`,
          }}
          ref={contentRef}
          id="resumePreviewContent"
        >
          <PersonalInfoHeader resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
          <SummarySection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
          <WorkExperienceSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
          <EducationSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
          {(resumeData.projects?.length ?? 0) > 0 && (
            <ProjectsSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
          )}
          <SkillsSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
          {(resumeData.certifications?.length ?? 0) > 0 && (
            <CertificationsSection resumeData={resumeData} primaryFontSize={primaryFontSize} secondaryFontSize={secondaryFontSize} />
          )}
        </div>
      </div>
    );
  }
  
  function PersonalInfoHeader({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
    const {
      photo,
      firstName,
      lastName,
      jobTitle,
      city,
      country,
      phone,
      email,
      primaryColorHex,
      borderStyle,
    } = resumeData;
  
    const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);
  
    useEffect(() => {
      const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
      if (objectUrl) setPhotoSrc(objectUrl);
      if (photo === null) setPhotoSrc("");
      return () => URL.revokeObjectURL(objectUrl);
    }, [photo]);
  
    return (
      <div className="flex items-center gap-6">
        {photoSrc && (
          <Image
            src={photoSrc}
            width={100}
            height={100}
            alt="Author photo"
            className="aspect-square object-cover"
            style={{
              borderRadius:
                borderStyle === BorderStyles.SQUARE
                  ? "0px"
                  : borderStyle === BorderStyles.CIRCLE
                    ? "9999px"
                    : "10%",
            }}
          />
        )}
        <div className="space-y-2.5">
          <div className="space-y-1">
            <p
              className="text-3xl font-bold"
              style={{
                color: primaryColorHex,
                fontSize: `${Math.round((primaryFontSize || 14) * 2.14)}px`,
              }}
            >
              {firstName} {lastName}
            </p>
            <p
              className="font-medium"
              style={{
                color: primaryColorHex,
                fontSize: `${Math.round((primaryFontSize || 14) * 1.43)}px`,
              }}
            >
              {jobTitle}
            </p>
          </div>
          <p className="text-xs text-gray-500" style={{ fontSize: `${secondaryFontSize || 12}px` }}>
            {city}
            {city && country ? ", " : ""}
            {country}
            {(city || country) && (phone || email) ? " • " : ""}
            {[phone, email].filter(Boolean).join(" • ")}
          </p>
        </div>
      </div>
    );
  }
  
  function SummarySection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
    const { summary, primaryColorHex } = resumeData;
  
    if (!summary) return null;
  
    return (
      <>
        <hr
          className="border-2"
          style={{
            borderColor: primaryColorHex,
          }}
        />
        <div className="break-inside-avoid space-y-3">
          <p
            className="text-lg font-semibold"
            style={{
              color: primaryColorHex,
              fontSize: `${Math.round((primaryFontSize || 14) * 1.29)}px`,
            }}
          >
            Professional profile
          </p>
          <div className="whitespace-pre-line text-sm" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{stripHtmlTags(summary || "")}</div>
        </div>
      </>
    );
  }
  
  function WorkExperienceSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
    const { workExperiences, primaryColorHex } = resumeData;
  
    const workExperiencesNotEmpty = workExperiences?.filter(
      (exp) => Object.values(exp).filter(Boolean).length > 0,
    );
  
    if (!workExperiencesNotEmpty?.length) return null;
  
    return (
      <>
        <hr
          className="border-2"
          style={{
            borderColor: primaryColorHex,
          }}
        />
        <div className="space-y-3">
          <p
            className="text-lg font-semibold"
            style={{
              color: primaryColorHex,
              fontSize: `${Math.round((primaryFontSize || 14) * 1.29)}px`,
            }}
          >
            Work experience
          </p>
          {workExperiencesNotEmpty.map((exp, index) => (
            <div key={index} className="break-inside-avoid space-y-1">
              <div
                className="flex items-center justify-between text-sm font-semibold"
                style={{
                  color: primaryColorHex,
                  fontSize: `${primaryFontSize || 14}px`,
                }}
              >
                <span>{exp.position}</span>
                {exp.startDate && (
                  <span>
                    {formatDate(new Date(exp?.startDate), "MM/yyyy")} - {" "}
                    {exp.endDate ? formatDate(new Date(exp?.endDate), "MM/yyyy") : "Present"}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{exp.company}</p>
              <div className="whitespace-pre-line text-xs" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{exp.description}</div>
            </div>
          ))}
        </div>
      </>
    );
  }
  
  function EducationSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
    const { educations, primaryColorHex } = resumeData;
  
    const educationsNotEmpty = educations?.filter(
      (edu) => Object.values(edu).filter(Boolean).length > 0,
    );
  
    if (!educationsNotEmpty?.length) return null;
  
    return (
      <>
        <hr
          className="border-2"
          style={{
            borderColor: primaryColorHex,
          }}
        />
        <div className="space-y-3">
          <p
            className="text-lg font-semibold"
            style={{
              color: primaryColorHex,
              fontSize: `${Math.round((primaryFontSize || 14) * 1.29)}px`,
            }}
          >
            Education
          </p>
          {educationsNotEmpty.map((edu, index) => (
            <div key={index} className="break-inside-avoid space-y-1">
              <div
                className="flex items-center justify-between text-sm font-semibold"
                style={{
                  color: primaryColorHex,
                  fontSize: `${primaryFontSize || 14}px`,
                }}
              >
                <span>{edu.degree}</span>
                {edu.startDate && (
                  <span>
                    {edu.startDate &&
                      `${formatDate(edu.startDate, "MM/yyyy")} ${edu.endDate ? `- ${formatDate(edu.endDate, "MM/yyyy")}` : ""}`
                    }
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{edu.school}</p>
            </div>
          ))}
        </div>
      </>
    );
  }
  
  function SkillsSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
    const { skillSections } = resumeData;
  
    if (!skillSections?.length) return null;
  
    return (
      <>
        <hr
          className="border-2"
          style={{
            borderColor: resumeData.primaryColorHex,
          }}
        />
        <div className="break-inside-avoid space-y-3">
          <p
            className="text-lg font-semibold"
            style={{
              color: resumeData.primaryColorHex,
              fontSize: `${Math.round((primaryFontSize || 14) * 1.29)}px`,
            }}
          >
            Skills
          </p>
          {skillSections.map((section, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-bold text-sm" style={{ fontSize: `${primaryFontSize || 14}px` }}>{section.name}</h3>
              <div className="flex flex-wrap gap-2">
                {section.skills.map((skill, skillIndex) => (
                  <Badge
                    key={skillIndex}
                    className="rounded-md bg-black text-white hover:bg-black"
                    style={{
                      backgroundColor: resumeData.primaryColorHex,
                      borderRadius:
                        resumeData.borderStyle === BorderStyles.SQUARE
                          ? "0px"
                          : resumeData.borderStyle === BorderStyles.CIRCLE
                            ? "9999px"
                            : "8px",
                      fontSize: `${secondaryFontSize || 12}px`,
                    }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  function ProjectsSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
    const { projects, primaryColorHex } = resumeData;

    const projectsNotEmpty = projects?.filter(
      (project) => Object.values(project).filter(Boolean).length > 0,
    );

    if (!projectsNotEmpty?.length) return null;

    return (
      <>
        <hr
          className="border-2"
          style={{
            borderColor: primaryColorHex,
          }}
        />
        <div className="space-y-3">
          <p
            className="text-lg font-semibold"
            style={{
              color: primaryColorHex,
              fontSize: `${Math.round((primaryFontSize || 14) * 1.29)}px`,
            }}
          >
            Projects
          </p>
          {projectsNotEmpty.map((project, index) => (
            <div key={index} className="break-inside-avoid space-y-1">
              <div
                className="flex items-center justify-between text-sm font-semibold"
                style={{
                  color: primaryColorHex,
                  fontSize: `${primaryFontSize || 14}px`,
                }}
              >
                <span>{project.name}</span>
                {project.startDate && (
                  <span>
                    {formatDate(new Date(project?.startDate), "MM/yyyy")} - {" "}
                    {project.endDate ? formatDate(new Date(project?.endDate), "MM/yyyy") : "Present"}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{project.role}</p>
              {project.description && (
                <div className="whitespace-pre-line text-xs" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{project.description}</div>
              )}
            </div>
          ))}
        </div>
      </>
    );
  }

  function CertificationsSection({ resumeData, primaryFontSize, secondaryFontSize }: ResumeSectionProps) {
    const { certifications, primaryColorHex } = resumeData;

    const certificationsNotEmpty = certifications?.filter(
      (cert) => Object.values(cert).filter(Boolean).length > 0,
    );

    if (!certificationsNotEmpty?.length) return null;

    return (
      <>
        <hr
          className="border-2"
          style={{
            borderColor: primaryColorHex,
          }}
        />
        <div className="space-y-3">
          <p
            className="text-lg font-semibold"
            style={{
              color: primaryColorHex,
              fontSize: `${Math.round((primaryFontSize || 14) * 1.29)}px`,
            }}
          >
            Certifications
          </p>
          {certificationsNotEmpty.map((cert, index) => (
            <div key={index} className="break-inside-avoid space-y-1">
              <div
                className="flex items-center justify-between text-sm font-semibold"
                style={{
                  color: primaryColorHex,
                  fontSize: `${primaryFontSize || 14}px`,
                }}
              >
                <span>{cert.name}</span>
                {cert.completionDate && (
                  <span>
                    {formatDate(new Date(cert?.completionDate), "MM/yyyy")}
                  </span>
                )}
              </div>
              {cert.source && (
                <p className="text-xs font-semibold" style={{ fontSize: `${secondaryFontSize || 12}px` }}>{cert.source}</p>
              )}
            </div>
          ))}
        </div>
      </>
    );
  }