import { Button } from "@resume/ui/button";
import { Form } from "@resume/ui/form"
import { EditorFormProps } from "utils/types";
import { workExperienceSchema, WorkExperienceValues } from "utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import WorkExperienceItem from "../WorkExperienceItem";
import { Plus } from "lucide-react";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

export default function WorkExperienceForm({
    resumeData,
    setResumeData
}: EditorFormProps) {
    const form = useForm<WorkExperienceValues>({
        resolver: zodResolver(workExperienceSchema),
        defaultValues: {
            workExperiences: resumeData.workExperiences || []
        }
    })

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();
            if(!isValid) return;
            setResumeData({ 
                ...resumeData, 
                workExperiences: values?.workExperiences?.filter((workExperience) => workExperience!== undefined) || [] })
        })
        
        return unsubscribe;
    }, [form, resumeData, setResumeData])

    const { fields, append, remove, move } = useFieldArray({
        control: form.control,
        name: "workExperiences"
    })

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        console.log(event)

        if(over && active.id !== over.id) {
            const oldIndex = fields.findIndex((field) => field.id === active.id); 
            const newIndex = fields.findIndex((field) => field.id === over.id);

            move(oldIndex, newIndex)
            return arrayMove(fields, oldIndex, newIndex);
        }
    }

    return (
        <div className="p-4 sm:p-6 space-y-4">
            <Form {...form}>
                <form className="space-y-4">
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <SortableContext 
                            items={fields} 
                            strategy={verticalListSortingStrategy}
                        >
                            {fields && fields.map((field, index) => (
                                <WorkExperienceItem 
                                    id={field.id}
                                    key={field.id}
                                    index={index}
                                    form={form}
                                    remove={remove}
                                />

                            ))}
                        </SortableContext>
                    </DndContext>
                    <div className="flex justify-center">
                        <Button 
                            type="button"
                            onClick={() => append({
                                position: "",
                                company: "",
                                startDate: "",
                                endDate: "",
                                description: ""
                            })}
                            className="w-full sm:max-w-sm"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add work experience
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}