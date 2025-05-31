// import ResumePreview from "../../../components/ResumePreview";
import { ResumeValues } from "utils/validations";
import BorderStyleButton from "./BorderStyleButton";
import cn from "@resume/ui/cn";

import Basic from "../templates/Basic";
import Diamond from "../templates/Diamond";
import Vibes from "../templates/Vibes";
import IT from "../templates/IT";
import Faang from "../templates/Faang"
import TwoColumn from "../templates/TwoColumn";
import AtsApproved from "../templates/AtsApproved"

import { JSX } from "react";

interface ResumePreviewSectionProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
    className?: string;
    selectedTemplate: string
}

interface Templates {
    [key: string]: (props: any) => JSX.Element; 
}

export default function ResumePreviewSection({
    resumeData,
    setResumeData,
    className,
    selectedTemplate
}: ResumePreviewSectionProps) {

    const templates: Templates = {
        faang: Faang,
        "two-column": TwoColumn,
        "ats-approved": AtsApproved,
        basic: Basic,
        diamond: Diamond,
        vibes: Vibes,
        it: IT,
    };
    
    const TemplateComponent = templates[selectedTemplate] || Basic;

    return (
        <div className={cn("group relative w-full rounded-md flex", className)}>
             <TemplateComponent resumeData={resumeData} className={" bg-white shadow-md"}/>
        </div>
    )
}