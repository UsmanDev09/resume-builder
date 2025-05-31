'use client'

import { Form, FormControl, FormField, FormItem, FormLabel } from "@resume/ui/form";
import { Textarea } from "@resume/ui/textarea";
import { EditorFormProps } from "utils/types";
import { summarySchema, SummaryValues } from "utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css";
import { QuillToolbar } from "./QuillToolbar";
import { useForm } from "react-hook-form";

export default function SummaryForm({
    resumeData, 
    setResumeData
} : EditorFormProps) {
    const form = useForm<SummaryValues>({  
        resolver: zodResolver(summarySchema),
        defaultValues: {
            summary: resumeData.summary || ""           
        }
    })
  const quillRef = useRef<ReactQuill>(null);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
          const isValid = await form.trigger();
          if (!isValid) return;
          setResumeData({
            ...resumeData,
            ...values,
          });
        });
    
        return unsubscribe;
      }, [form, resumeData, setResumeData]);
    
      const handleFormat = (format: string) => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;
    
        const selection = quill.getSelection();
        if (!selection) return;
    
        if (format === "list") {
          const currentFormat = quill.getFormat(selection);
          quill.format("list", currentFormat.list ? false : "bullet");
        } else {
          const currentFormat = quill.getFormat(selection);
          quill.format(format, !currentFormat[format]);
        }
    
        setTimeout(() => {
          const newFormats = quill.getFormat(quill.getSelection() || undefined);
          setActiveFormats(Object.keys(newFormats));
        }, 0);
      };
    
    return (
        <div className="p-6 space-y-4">
            <Form {...form}>
                <form className="space-y-4">
                    <FormField
                        control={form.control}
                        name="summary"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Professional Summary
                                </FormLabel>
                                <QuillToolbar
                                    onFormat={handleFormat}
                                    activeFormats={activeFormats}
                                />
                                 <FormControl>
                                        <ReactQuill
                                            ref={quillRef}
                                            theme="snow"
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="A brief engaging summary about yourself..."
                                            modules={{
                                            toolbar: false,
                                            }}
                                            onChangeSelection={(range) => {
                                            if (!range) return;
                                            const quill = quillRef.current?.getEditor();
                                            if (!quill) return;
                                            const formats = quill.getFormat(range);
                                            setActiveFormats(Object.keys(formats));
                                            }}
                                            className="[&_.ql-container]:border-border [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:text-white [&_.ql-editor]:bg-background [&_.ql-container]:rounded-md [&_.ql-editor]:rounded-md"
                                        />

                                    </FormControl>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    )
}