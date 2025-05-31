'use client'

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ResumeValues } from "utils/validations"
import ResumePreviewSection from "./ResumePreviewSection"
import cn from "@resume/ui/cn";
import useAutoSaveReume from "./useAutoSaveResume"
import useUnloadWarning from "@resume/ui/hooks/use-unload-warning"
import { ResumeServerData } from "utils/types"
import { mapToResumeValues, mapReduxResumeToFormValues } from "utils/utils"
import TemplateSelector from "./TemplateSelector"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@resume/ui/resizable";
import { useAppSelector, useAppDispatch } from "utils/lib/redux/hooks"
import { selectResume, setResume, initialResumeState } from "utils/lib/redux/resumeSlice"
import { Button } from "@resume/ui/button"
import { ChevronDown, ChevronRight, Plus } from "lucide-react"
import { steps } from "./steps"
import ColorPicker from "./ColorPicker"
import BorderStyleButton from "./BorderStyleButton"
import FontSizeSelector from "./FontSizeSelector"
import FontStyleSelector from "./FontStyleSelector"
import Link from "next/link"

interface ResumeEditorProps {
    resumeToEdit: ResumeServerData | null;
}

type TabType = 'content' | 'templates' | 'designer';

export default function ResumeEditor({ resumeToEdit } : ResumeEditorProps) {
    const searchParams = useSearchParams();
    const storedResume = useAppSelector(selectResume);
    const dispatch = useAppDispatch();
    
    const [activeTab, setActiveTab] = useState<TabType>('content');
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general-info']));

    // Priority order: Redux state > Database resume > Empty form
    const getInitialResumeData = (): ResumeValues => {
        // Check if Redux has parsed resume data (from upload)
        const hasReduxData = storedResume && (
            storedResume.profile.name || 
            storedResume.profile.email || 
            storedResume.workExperiences.some(exp => exp.company) ||
            storedResume.educations.some(edu => edu.school) ||
            storedResume.projects.some(proj => proj.project)
        );

        if (hasReduxData) {
            console.log('Using Redux state for resume data');
            return {
                ...mapReduxResumeToFormValues(storedResume),
                selectedTemplate: 'simple'
            } as ResumeValues;
        }
        
        // Fall back to database resume if editing existing
        if (resumeToEdit) {
            console.log('Using database resume for resume data');
            return mapToResumeValues(resumeToEdit);
        }
        
        // Default empty form
        console.log('Using empty form for resume data');
        return { 
            selectedTemplate: 'simple',
            skillSections: []
        } as ResumeValues;
    };

    const [resumeData, setResumeData] = useState<ResumeValues>(getInitialResumeData());
    
    // Clear Redux state if we're starting a new resume (not from upload and not editing existing)
    useEffect(() => {
        const hasReduxData = storedResume && (
            storedResume.profile.name || 
            storedResume.profile.email || 
            storedResume.workExperiences.some(exp => exp.company) ||
            storedResume.educations.some(edu => edu.school) ||
            storedResume.projects.some(proj => proj.project)
        );
        
        // If we have Redux data but no resumeToEdit, it means we used the Redux data and should clear it
        // to prevent it from interfering with future resume creation
        if (hasReduxData && !resumeToEdit) {
            // Small delay to ensure the form is populated first
            const timeoutId = setTimeout(() => {
                console.log('Clearing Redux state after successful form population');
                dispatch(setResume(initialResumeState));
            }, 1000);
            
            return () => clearTimeout(timeoutId);
        }
    }, [dispatch, resumeToEdit, storedResume]);
    
    console.log('resumeData', resumeData)
    const [showResumePreviewOnSmallScreen, setShowResumePreviewOnSmallScreen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(resumeData.selectedTemplate);

    const { isSaving, hasUnsavedData } = useAutoSaveReume(resumeData);

    useUnloadWarning(hasUnsavedData)

    const toggleSection = (sectionKey: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionKey)) {
            newExpanded.delete(sectionKey);
        } else {
            newExpanded.add(sectionKey);
        }
        setExpandedSections(newExpanded);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'content':
                return (
                    <div className="space-y-2 sm:space-y-3">
                        {steps.map((step) => {
                            const isExpanded = expandedSections.has(step.key);
                            const FormComponent = step.component;
                            
                            return (
                                <div key={step.key} className="rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleSection(step.key)}
                                        className="w-full flex items-center border-b border-gray-200 dark:border-gray-700 justify-between p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            {isExpanded ? (
                                                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                            )}
                                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">{step.title}</h3>
                                        </div>
                                    </button>
                                    
                                    {isExpanded && (
                                        <div className="pl-8 sm:pl-10 pr-3 sm:pr-4 pb-3 sm:pb-4">
                                            <FormComponent
                                                resumeData={resumeData}
                                                setResumeData={setResumeData}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            case 'templates':
                return (
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="p-4 sm:p-6">
                            <div className="space-y-1.5 text-center mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-semibold">Choose Template</h2>
                                <p className="text-sm text-muted-foreground">Select a template for your resume</p>
                            </div>
                            <TemplateSelector
                                onSelectTemplate={setSelectedTemplate}
                                setResumeData={setResumeData}
                                resumeData={resumeData}
                            />
                        </div>
                    </div>
                );
            case 'designer':
                return (
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="p-4 sm:p-6">
                            <div className="space-y-1.5 text-center mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-semibold">Designer</h2>
                                <p className="text-sm text-muted-foreground">Customize the appearance of your resume</p>
                            </div>
                            
                            <div className="space-y-4 sm:space-y-6">
                                {/* Colors Section */}
                                <div className="space-y-3">
                                    <h3 className="text-base sm:text-lg font-medium">Colors</h3>
                                    <div className="flex justify-center">
                                        <ColorPicker 
                                            primaryColor={resumeData.primaryColorHex}
                                            secondaryColor={resumeData.secondaryColorHex}
                                            onPrimaryColorChange={(color) =>
                                                setResumeData({ ...resumeData, primaryColorHex: color.hex })
                                            }
                                            onSecondaryColorChange={(color) =>
                                                setResumeData({ ...resumeData, secondaryColorHex: color.hex })
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Border Style Section */}
                                <div className="space-y-3">
                                    <h3 className="text-base sm:text-lg font-medium">Border Style</h3>
                                    <div className="flex justify-center">
                                        <BorderStyleButton 
                                            //@ts-ignore
                                            borderStyle={resumeData.borderStyle} 
                                            onChange={(borderStyle) => setResumeData({ ...resumeData, borderStyle })}    
                                        />
                                    </div>
                                </div>

                                {/* Typography Section */}
                                <div className="space-y-3 sm:space-y-4">
                                    <h3 className="text-base sm:text-lg font-medium">Typography</h3>
                                    
                                    <div className="space-y-3 sm:space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Font Family</label>
                                            <FontStyleSelector
                                                fontStyle={resumeData.fontStyle || "Arial"}
                                                onFontStyleChange={(fontStyle) =>
                                                    setResumeData({ ...resumeData, fontStyle })
                                                }
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Primary Font Size</label>
                                                <FontSizeSelector
                                                    //@ts-ignore
                                                    fontSize={resumeData.primaryFontSize || "medium"}
                                                    onFontSizeChange={(fontSize) =>
                                                        setResumeData({ ...resumeData, primaryFontSize: fontSize })
                                                    }
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Secondary Font Size</label>
                                                <FontSizeSelector
                                                    //@ts-ignore
                                                    fontSize={resumeData.secondaryFontSize || "small"}
                                                    onFontSizeChange={(fontSize) =>
                                                        setResumeData({ ...resumeData, secondaryFontSize: fontSize })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Section */}
                                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                                        <Button variant="secondary" asChild className="w-full sm:w-auto">
                                            <Link href="/resumes">Close Editor</Link>
                                        </Button>
                                        <div className="flex items-center gap-2">
                                            <span className={cn("text-sm text-muted-foreground opacity-0", isSaving && 'opacity-100')}>
                                                Saving...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex grow flex-col h-screen">
            {/* Sub-header with tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-transparent p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('content')}
                            className={cn(
                                "px-4 py-2 font-medium text-sm rounded-md transition-all whitespace-nowrap flex items-center gap-2",
                                activeTab === 'content'
                                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
                            )}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                            </svg>
                            Content Editor
                        </button>
                        <button
                            onClick={() => setActiveTab('templates')}
                            className={cn(
                                "px-4 py-2 font-medium text-sm rounded-md transition-all whitespace-nowrap flex items-center gap-2",
                                activeTab === 'templates'
                                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
                            )}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                            </svg>
                            Templates
                        </button>
                        <button
                            onClick={() => setActiveTab('designer')}
                            className={cn(
                                "px-4 py-2 font-medium text-sm rounded-md transition-all whitespace-nowrap flex items-center gap-2",
                                activeTab === 'designer'
                                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
                            )}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zM3 15a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1zm7-1a1 1 0 000 2h4a1 1 0 100-2h-4z" clipRule="evenodd"/>
                            </svg>
                            Designer
                        </button>
                    </div>
                    
                    {/* Mobile preview toggle */}
                    <div className="md:hidden flex-shrink-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowResumePreviewOnSmallScreen(!showResumePreviewOnSmallScreen)}
                        >
                            {showResumePreviewOnSmallScreen ? 'Edit' : 'Preview'}
                        </Button>
                    </div>
                </div>
            </div>

          <main className="relative grow w-full">
              <div className="absolute bottom-0 top-0 flex w-full">
                  <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg">
                        {/* Content Panel */}
                        <ResizablePanel 
                            defaultSize={50} 
                            minSize={30} 
                            maxSize={70} 
                            className={cn(
                        "flex flex-col h-full",
                                showResumePreviewOnSmallScreen && "hidden md:flex"
                            )}
                        >
                      <div className="h-full min-h-0">
                                <div className="h-full p-3 sm:p-6 overflow-y-auto bg-gray-50 dark:bg-gray-950 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
                                    {renderTabContent()}
                        </div>
                      </div>
                      </ResizablePanel>
                        
                        <ResizableHandle withHandle className="hidden md:flex" />
                        
                        {/* Preview Panel */}
                      <ResizablePanel
                        defaultSize={50}
                        className={cn(
                                "flex-col overflow-hidden",
                                showResumePreviewOnSmallScreen ? "flex" : "hidden md:flex"
                        )}
                      >
                            <div className="p-1 sm:p-2 min-h-0 overflow-y-auto bg-gray-200 dark:bg-gray-800 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-300 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded-full">
                          <ResumePreviewSection
                            resumeData={resumeData}
                            setResumeData={setResumeData}
                            selectedTemplate={selectedTemplate}
                          />
                        </div>
                      </ResizablePanel>
                  </ResizablePanelGroup>
              </div>
          </main>
      </div>
    )
}


