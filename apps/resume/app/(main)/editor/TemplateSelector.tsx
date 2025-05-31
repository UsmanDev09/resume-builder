import Image from "next/image";
import { useState } from "react";
import cn from "@resume/ui/cn";
import { ResumeValues } from "utils/validations";

interface TemplateSelectorProps {
    className?: string;
    onSelectTemplate: (templateName: string) => void;
    setResumeData: (resumeData: ResumeValues) => void;
    resumeData: ResumeValues
}

const templates = [
  { name: 'faang', src: "/assets/images/faang.png" },
  { name: 'ats-approved', src: "/assets/images/ats-approved.png" },
  { name: 'two-column', src: "/assets/images/two-column.png" },
  { name: 'simple', src: "/assets/images/simple.png" },
  { name: 'diamond', src: "/assets/images/diamond.png" },
  { name: 'it', src: "/assets/images/it.png" },
  { name: 'vibes', src: "/assets/images/vibes.png" },
];

export default function TemplateSelector({
    className,
    onSelectTemplate,
    setResumeData,
    resumeData
}: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(resumeData.selectedTemplate);

  const handleTemplateClick = (templateName: string) => {
    setSelectedTemplate(templateName);
    onSelectTemplate(templateName);
    setResumeData({
        ...resumeData, 
        selectedTemplate: templateName
    })
  };

  return (
    <div
      className={cn(
        `h-full overflow-y-auto p-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-full`,
        className
      )}
    >
      {/* <h2 className="text-lg mb-4">Choose Template</h2> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {templates.map((template) => (
          <div
            key={template.name}
            className="cursor-pointer overflow-hidden group"
            onClick={() => handleTemplateClick(template.name)}
          >
            <div className="relative">
              <Image
                src={template.src || "/placeholder.svg"}
                alt={template.name}
                width={141}
                height={200}
                className={cn(
                  "w-full h-auto rounded-lg border-2 transition-all duration-200 group-hover:shadow-lg group-hover:scale-105",
                  selectedTemplate === template.name
                    ? "border-blue-500 shadow-lg scale-105"
                    : "border-gray-200 dark:border-gray-700"
                )}
              />
              {selectedTemplate === template.name && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
              )}
            </div>
            <p className="text-sm text-center mt-2 font-medium text-gray-700 dark:text-gray-300 capitalize">
              {template.name.replace('-', ' ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}