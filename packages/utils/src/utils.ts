import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ResumeServerData } from "./types";
import type { Resume } from "utils/lib/redux/types";
import { ResumeValues } from "./validations";
import { parse } from "path";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function fileReplacer(key: string, value: File) {
  return value instanceof File ? {
      name: value.name,
      size: value.name,
      type: value.type,
      lastModified: value.lastModified
  } : value;
}

export function mapToResumeValues(data: ResumeServerData) {
  console.log('data', data)
  return {
      id: data.id,
      title: data.title || undefined,
      description: data.description || undefined,
      photo: data.photoUrl || undefined,
      firstName: data.firstName || undefined,
      lastName: data.lastName || undefined,
      jobTitle: data.jobTitle || undefined,
      phone: data.phone || undefined,
      city: data.city || undefined,
      country: data.country || undefined,
      email: data.email || undefined,
      workExperiences: data.workExperience && data.workExperience.map((exp: any) => ({
          position: exp.position || undefined,
          company: exp.company || undefined,
          startDate: exp.startDate ? exp.startDate.toISOString().split("T")[0] : undefined,
          endDate: exp.endDate ? exp.endDate.toISOString().split("T")[0] : undefined,
          description: exp.description || undefined
      })),
      educations: data.Education && data.Education.map((edu: any) => ({
          degree: edu.degree || undefined,
          school: edu.school || undefined,
          startDate: edu.startDate ? edu.startDate.toISOString().split("T")[0] : undefined,
          endDate: edu.endDate ? edu.endDate.toISOString().split("T")[0] : undefined,
      })),
      skillSections: data.skillSections?.map((section: any) => ({
          id: section.id,
          name: section.name,
          skills: section.skills,
          order: section.order
      })) || [],
      primaryColorHex: data.primaryColorHex,
      borderStyle: data.borderStyle,
      summary: data.summary || undefined,
      selectedTemplate: data.selectedTemplate,
  }
}

/**
 * Convert parsed resume to Redux Resume format
 * This function creates the proper nested structure expected by Redux store
 */
export function mapParsedResumeToReduxFormat(parsedResume: Resume): Resume {
  return {
    profile: {
      name: parsedResume.profile.name || "",
      email: parsedResume.profile.email || "",
      phone: parsedResume.profile.phone || "",
      location: parsedResume.profile.location || "",
      url: parsedResume.profile.url || "",
      summary: parsedResume.profile.summary || ""
    },
    workExperiences: parsedResume.workExperiences.map(exp => ({
      company: exp.company || "",
      jobTitle: exp.jobTitle || "",
      date: exp.date || "",
      descriptions: exp.descriptions || []
    })),
    educations: parsedResume.educations.map(edu => ({
      school: edu.school || "",
      degree: edu.degree || "",
      date: edu.date || "",
      gpa: edu.gpa || "",
      descriptions: edu.descriptions || []
    })),
    projects: parsedResume.projects.map(project => ({
      project: project.project || "",
      date: project.date || "",
      descriptions: project.descriptions || []
    })),
    skills: {
      featuredSkills: parsedResume.skills.featuredSkills || [],
      descriptions: parsedResume.skills.descriptions || []
    },
    custom: {
      descriptions: parsedResume.custom?.descriptions || []
    }
  };
}

/**
 * Convert Redux Resume format to Form ResumeValues format
 * This function flattens the nested Redux structure to the flat form structure
 */
export function mapReduxResumeToFormValues(reduxResume: Resume): Partial<ResumeValues> {
  // Helper function to parse date ranges and convert to YYYY-MM-DD format
  const parseDateRange = (dateStr: string) => {
    if (!dateStr) return { startDate: "", endDate: "" };
    
    // Handle formats like "Jan 2020 - Present", "2020 - 2022", "Jan 2020 - Dec 2022", etc.
    const parts = dateStr.split(" - ");
    const startPart = parts[0]?.trim() || "";
    const endPart = parts[1]?.trim() || "";
    
    const convertToISODate = (dateInput: string): string => {
      if (!dateInput || dateInput.toLowerCase() === "present") return "";
      
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
        return dateInput;
      }
      
      // If it's just a year (e.g., "2020")
      if (/^\d{4}$/.test(dateInput)) {
        return `${dateInput}-01-01`;
      }
      
      // If it's month and year (e.g., "Jan 2020", "January 2020")
      const monthYearMatch = dateInput.match(/^(\w+)\s+(\d{4})$/);
      if (monthYearMatch && monthYearMatch[1] && monthYearMatch[2]) {
        const monthStr = monthYearMatch[1];
        const year = monthYearMatch[2];
        const monthMap: { [key: string]: string } = {
          'jan': '01', 'january': '01',
          'feb': '02', 'february': '02',
          'mar': '03', 'march': '03',
          'apr': '04', 'april': '04',
          'may': '05',
          'jun': '06', 'june': '06',
          'jul': '07', 'july': '07',
          'aug': '08', 'august': '08',
          'sep': '09', 'september': '09',
          'oct': '10', 'october': '10',
          'nov': '11', 'november': '11',
          'dec': '12', 'december': '12'
        };
        
        const monthNum = monthMap[monthStr.toLowerCase()];
        if (monthNum && year) {
          return `${year}-${monthNum}-01`;
        }
      }
      
      // If nothing matches, try to parse with Date constructor as fallback
      try {
        const date = new Date(dateInput);
        if (!isNaN(date.getTime())) {
          const isoString = date.toISOString();
          const datePart = isoString.split('T')[0];
          return datePart || "";
        }
      } catch (e) {
        // Ignore parsing errors
      }
      
      // If all else fails, return empty string
      return "";
    };
    
    return {
      startDate: convertToISODate(startPart),
      endDate: convertToISODate(endPart)
    };
  };

  return {
    // Profile data (flatten the nested structure)
    firstName: reduxResume.profile.name.split(" ")[0] || "",
    lastName: reduxResume.profile.name.split(" ").slice(1).join(" ") || "",
    email: reduxResume.profile.email || "",
    phone: reduxResume.profile.phone || "",
    city: reduxResume.profile.location || "",
    country: reduxResume.profile.location || "",
    jobTitle: reduxResume.workExperiences[0]?.jobTitle || "",
    linkedin: reduxResume.profile.url || "",
    website: reduxResume.profile.url || "",
    
    // Work experiences (convert from Redux format to form format)
    workExperiences: reduxResume.workExperiences.map(exp => {
      const dateRange = parseDateRange(exp.date);
      return {
        position: exp.jobTitle || "",
        company: exp.company || "",
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        description: exp.descriptions.join("\n") || ""
      };
    }),
    
    // Education (convert format)
    educations: reduxResume.educations.map(edu => {
      const dateRange = parseDateRange(edu.date);
      return {
        degree: edu.degree || "",
        school: edu.school || "",
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
        // Note: Education table doesn't have description field in schema
      };
    }),
    
    // Projects (convert format) - Note: schema expects 'role' field not 'description'
    projects: reduxResume.projects.map(project => {
      const dateRange = parseDateRange(project.date);
      return {
        name: project.project || "",
        role: "", // Schema expects role field
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        description: project.descriptions.join("\n") || ""
      };
    }),
    
    // Skills (convert from Redux skills to form skillSections)
    skillSections: reduxResume.skills.descriptions.length > 0 ? [{
      id: "1",
      name: "Skills",
      skills: reduxResume.skills.descriptions,
      order: 0
    }] : [],
    
    // Summary
    summary: reduxResume.profile.summary || "",
    
    // Default styling
    selectedTemplate: "simple",
    borderStyle: "square",
    primaryColorHex: "#000000"
  };
}

// Keep the old function name for backward compatibility, but make it use the new function
export function mapParsedResumeToResumeValues(parsedResume: Resume) {
  return mapParsedResumeToReduxFormat(parsedResume);
}

/**
 * Strip HTML tags from text content
 * Uses DOMParser on client-side for accurate parsing, regex fallback for server-side
 */
export function stripHtmlTags(html: string): string {
  if (!html) return "";
  
  if (typeof window !== 'undefined') {
    // Client-side: use DOMParser for accurate HTML parsing
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }
  
  // Server-side fallback: basic regex to remove HTML tags
  return html.replace(/<[^>]*>/g, '');
}