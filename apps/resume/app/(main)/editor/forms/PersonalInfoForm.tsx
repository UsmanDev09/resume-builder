import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@resume/ui/form"
import { useForm } from "react-hook-form"

import { personalInfoSchema, PersonalInfoValues } from "utils/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@resume/ui/input"
import { useEffect, useRef } from "react"
import { EditorFormProps } from "utils/types"
import { Button } from "@resume/ui/button"

export default function PersonalInfoForm({
    resumeData, 
    setResumeData
} : EditorFormProps) {
    const fields = [{ name: "firstName", label: 'First Name', type: "text", placeholder: "John" }, { name: 'lastName', label: 'Last Name', type: "text", placeholder: 'Doe' }, {name: 'email', label: 'Email', type: "email", placeholder: 'resume@gmail.com' }, { name: 'phone', label: 'Phone', type: "tel", placeholder: '+44312131223' }, { name: 'jobTitle', label: 'Job Title', type: "text", placeholder: 'Software Engineer' }, { name: 'city', label: 'City', type: "text", placeholder: 'Austin' }, { name: 'country', label: 'Country', type: "text", placeholder: 'USA', }, {name: "linkedin", label: "LinkedIn", type: "text", placeholder: "www.linkedin.com/in/johndoe" }, { name: "github", label: "Github", type: "text", placeholder: "www.github.com/johndoe" }, { name: "website", label: "Personal website", type: "text", placeholder: "https://johndoe.com"}]
    
    const form = useForm<PersonalInfoValues>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            firstName: resumeData.firstName || "",
            lastName: resumeData.lastName || "",
            jobTitle: resumeData.jobTitle || "",
            email: resumeData.email || "",
            city: resumeData.city || "",
            country:resumeData.country || "",
            phone: resumeData.phone || "",
            linkedin: resumeData.linkedin || "",
            github: resumeData.github,
            website: resumeData.website
        }
    })

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();
            if(!isValid) return;
            setResumeData({ ...resumeData, ...values })
        })
        
        return unsubscribe;
    }, [form, resumeData, setResumeData])

    const photoInputRef = useRef<HTMLInputElement>(null);
    
    return (
        <div className="p-4 sm:p-6 space-y-4">
            <Form {...form}>
                <form className="space-y-4">
                    <FormField
                        control={form.control}
                        name="photo"
                        render={({ field: { value, ...fieldValues} }) => (
                            <FormItem>
                                <FormLabel>Your photo</FormLabel>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                        <FormControl>
                                            <Input 
                                                {...fieldValues}
                                                type="file"
                                                accept="image/*" 
                                                placeholder="My resume" 
                                                autoFocus 
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    fieldValues.onChange(file)
                                                }}
                                                ref={photoInputRef}
                                                className="flex-1"
                                            />
                                        </FormControl>
                                        <Button
                                            variant="secondary"
                                            type="button"
                                            size="sm"
                                            onClick={() => {
                                                fieldValues.onChange(null);
                                                if(photoInputRef.current) {
                                                    photoInputRef.current.value = "";
                                                }
                                            }}
                                            className="w-full sm:w-auto"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                <FormMessage /> 
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {fields && fields.map(({ name, label, type, placeholder }, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name={name as keyof Omit<PersonalInfoValues, "photo">}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{label}</FormLabel>
                                        <FormControl>
                                            <Input {...field} type={type} placeholder={placeholder} />
                                        </FormControl>
                                        <FormMessage /> 
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                </form>
            </Form>
        </div>
    )
}