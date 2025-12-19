import { FormField, useFormEditorStore } from "@/store/form-editor"
import { Plus, X } from "lucide-react"

export function PropertiesPanel() {
    const { fields, selectedFieldId, updateField, selectField } = useFormEditorStore()
    const field = fields.find((f) => f._id === selectedFieldId)

    if (!field) {
        return (
            <div className="p-6 text-center text-neutral-500 dark:text-neutral-400">
                <p>Select a field to edit its properties</p>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                    Properties
                </h3>
                <button onClick={() => selectField(null)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Label</label>
                    <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(field._id, { label: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="required"
                        checked={field.validation?.required ?? field.required ?? false}
                        onChange={(e) => updateField(field._id, {
                            validation: { ...field.validation, required: e.target.checked }
                        })}
                        className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="required" className="text-sm text-neutral-700 dark:text-neutral-300">Required field</label>
                </div>

                {(field.type === 'number' || field.type === 'text' || field.type === 'long_text') && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                {field.type === 'number' ? 'Min Value' : 'Min Length'}
                            </label>
                            <input
                                type="number"
                                value={field.validation?.min ?? field.min ?? ''}
                                onChange={(e) => updateField(field._id, {
                                    validation: {
                                        ...field.validation,
                                        min: e.target.value ? Number(e.target.value) : undefined
                                    }
                                })}
                                className="w-full px-3 py-2 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                {field.type === 'number' ? 'Max Value' : 'Max Length'}
                            </label>
                            <input
                                type="number"
                                value={field.validation?.max ?? field.max ?? ''}
                                onChange={(e) => updateField(field._id, {
                                    validation: {
                                        ...field.validation,
                                        max: e.target.value ? Number(e.target.value) : undefined
                                    }
                                })}
                                className="w-full px-3 py-2 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                )}

                {(field.type === 'multiple_choice' || field.type === 'checkbox' || field.type === 'dropdown') && (
                    <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Options</label>
                        <div className="space-y-2">
                            {field.options?.map((option, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => {
                                            const newOptions = [...(field.options || [])]
                                            newOptions[index] = e.target.value
                                            updateField(field._id, { options: newOptions })
                                        }}
                                        className="flex-1 px-3 py-1.5 rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={() => {
                                            const newOptions = field.options?.filter((_, i) => i !== index)
                                            updateField(field._id, { options: newOptions })
                                        }}
                                        className="p-1.5 text-neutral-400 hover:text-red-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`]
                                updateField(field._id, { options: newOptions })
                            }}
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            <Plus className="h-4 w-4" />
                            Add Option
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
