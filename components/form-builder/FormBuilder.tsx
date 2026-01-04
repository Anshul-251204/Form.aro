"use client"

import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useFormEditorStore } from "@/store/form-editor"
import { Toolbox } from "./Toolbox"
import { SortableField } from "./SortableField"
import { PropertiesPanel } from "./PropertiesPanel"
import { Palette, Plus, Settings2, X } from "lucide-react"
import { useState, useEffect } from "react"

export function FormBuilder() {
    const { fields, addField, removeField, selectField, selectedFieldId, moveField, title, description, setTitle, setDescription } = useFormEditorStore()
    const [showMobileToolbox, setShowMobileToolbox] = useState(false)
    const [showMobileProperties, setShowMobileProperties] = useState(false)

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

    // Close mobile properties panel when no field is selected
    useEffect(() => {
        if (!selectedFieldId) {
            setShowMobileProperties(false)
        }
    }, [selectedFieldId])

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] relative">
            {/* Left Sidebar: Toolbox (Desktop) */}
            <div className="hidden md:block w-64 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 overflow-y-auto h-full">
                <Toolbox onAddField={addField} />
            </div>

            {/* Main Canvas */}
            <div className="flex-1 bg-neutral-100 dark:bg-black p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 min-h-[500px] p-4 md:p-8">
                        <div className="mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white bg-transparent border-none focus:ring-0 p-0 w-full placeholder:text-neutral-400"
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
                                items={fields.map((f) => f._id)}
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
                                            key={field._id}
                                            field={field}
                                            isSelected={selectedFieldId === field._id}
                                            onSelect={() => {
                                                selectField(field._id)
                                                // On mobile, open properties when a field is selected
                                                if (window.innerWidth < 768) {
                                                    setShowMobileProperties(true)
                                                }
                                            }}
                                            onRemove={() => removeField(field._id)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>
            </div>

            {/* Right Sidebar: Properties (Desktop) */}
            <div className="hidden md:block w-80 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-y-auto h-full">
                <PropertiesPanel />
            </div>

            {/* Mobile Toolbar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 p-4 flex items-center justify-center z-40 safe-area-bottom">
                <button
                    onClick={() => setShowMobileToolbox(true)}
                    className="flex flex-col items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 w-full"
                >
                    <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Plus className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium">Add Field</span>
                </button>
            </div>

            {/* Mobile Toolbox Overlay */}
            {showMobileToolbox && (
                <div className="md:hidden fixed inset-0 z-50 bg-neutral-50 dark:bg-neutral-950 flex flex-col animate-in slide-in-from-bottom-full duration-200">
                    <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                        <h3 className="font-semibold text-lg">Add Elements</h3>
                        <button
                            onClick={() => setShowMobileToolbox(false)}
                            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <Toolbox onAddField={(type) => {
                            addField(type)
                            setShowMobileToolbox(false)
                        }} />
                    </div>
                </div>
            )}

            {/* Mobile Properties Overlay */}
            {showMobileProperties && (
                <div className="md:hidden fixed inset-0 z-50 bg-white dark:bg-neutral-950 flex flex-col animate-in slide-in-from-bottom-full duration-200">
                    <div className="flex-1 overflow-y-auto">
                        <PropertiesPanel />
                    </div>
                </div>
            )}
        </div>
    )
}
