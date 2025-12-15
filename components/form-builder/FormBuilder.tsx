"use client"

import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useFormEditorStore } from "@/store/form-editor"
import { Toolbox } from "./Toolbox"
import { SortableField } from "./SortableField"
import { PropertiesPanel } from "./PropertiesPanel"

export function FormBuilder() {
    const { fields, addField, removeField, selectField, selectedFieldId, moveField, title, description, setTitle, setDescription } = useFormEditorStore()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (over && active.id !== over.id) {
            moveField(active.id as string, over.id as string)
        }
    }

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
            {/* Left Sidebar: Toolbox */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 overflow-y-auto h-auto md:h-full">
                <Toolbox onAddField={addField} />
            </div>

            {/* Main Canvas */}
            <div className="flex-1 bg-neutral-100 dark:bg-black p-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 min-h-[500px] p-8">
                        <div className="mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-3xl font-bold text-neutral-900 dark:text-white bg-transparent border-none focus:ring-0 p-0 w-full placeholder:text-neutral-400"
                                placeholder="Form Title"
                            />
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="text-neutral-500 mt-2 bg-transparent border-none focus:ring-0 p-0 w-full placeholder:text-neutral-400"
                                placeholder="Form Description"
                            />
                        </div>

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={fields.map((f) => f.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-4">
                                    {fields.length === 0 && (
                                        <div className="text-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                                            <p className="text-neutral-500">Drag fields here or click to add</p>
                                        </div>
                                    )}
                                    {fields.map((field) => (
                                        <SortableField
                                            key={field.id}
                                            field={field}
                                            isSelected={selectedFieldId === field.id}
                                            onSelect={() => selectField(field.id)}
                                            onRemove={() => removeField(field.id)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>
            </div>

            {/* Right Sidebar: Properties */}
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 h-auto md:h-full">
                <PropertiesPanel />
            </div>
        </div>
    )
}
