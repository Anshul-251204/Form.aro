import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { GripVertical, Trash2 } from "lucide-react"
import { FormField } from "@/store/form-editor"

interface SortableFieldProps {
    field: FormField
    isSelected: boolean
    onSelect: () => void
    onRemove: () => void
}

export function SortableField({ field, isSelected, onSelect, onRemove }: SortableFieldProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: field._id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "relative group flex items-start gap-4 p-4 rounded-xl border-2 bg-white dark:bg-neutral-900 transition-all cursor-pointer",
                isSelected
                    ? "border-blue-500 shadow-md"
                    : "border-transparent hover:border-neutral-200 dark:hover:border-neutral-800"
            )}
            onClick={onSelect}
        >
            <div
                {...attributes}
                {...listeners}
                className="mt-1 p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-grab active:cursor-grabbing text-neutral-400"
            >
                <GripVertical className="h-5 w-5" />
            </div>

            <div className="flex-1 space-y-2">
                <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>

                {/* Preview of the field input */}
                <div className="pointer-events-none">
                    {field.type === 'text' && (
                        <input type="text" disabled className="w-full px-3 py-2 rounded-md border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 text-sm" placeholder="Short answer text" />
                    )}
                    {field.type === 'long_text' && (
                        <textarea disabled className="w-full px-3 py-2 rounded-md border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 text-sm" placeholder="Long answer text" rows={3} />
                    )}
                    {(field.type === 'multiple_choice' || field.type === 'checkbox' || field.type === 'dropdown') && (
                        <div className="space-y-2">
                            {field.options?.map((option, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                    <div className={cn("h-4 w-4 border border-neutral-300 dark:border-neutral-700", field.type === 'multiple_choice' ? 'rounded-full' : 'rounded')} />
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                    {field.type === 'date' && (
                        <input type="date" disabled className="w-full px-3 py-2 rounded-md border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 text-sm" />
                    )}
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation()
                    onRemove()
                }}
                className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    )
}
