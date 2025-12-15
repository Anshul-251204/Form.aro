import { FieldType } from "@/store/form-editor"
import { AlignLeft, Calendar, CheckSquare, ChevronDown, Hash, List, Mail, Type } from "lucide-react"

interface ToolboxProps {
    onAddField: (type: FieldType) => void
}

const fieldTypes: { type: FieldType; label: string; icon: any }[] = [
    { type: 'text', label: 'Short Text', icon: Type },
    { type: 'long_text', label: 'Long Text', icon: AlignLeft },
    { type: 'number', label: 'Number', icon: Hash },
    { type: 'email', label: 'Email', icon: Mail },
    { type: 'multiple_choice', label: 'Multiple Choice', icon: List },
    { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
    { type: 'dropdown', label: 'Dropdown', icon: ChevronDown },
    { type: 'date', label: 'Date', icon: Calendar },
]

export function Toolbox({ onAddField }: ToolboxProps) {
    return (
        <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                Fields
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {fieldTypes.map((item) => (
                    <button
                        key={item.type}
                        onClick={() => onAddField(item.type)}
                        className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 bg-white hover:border-blue-500 hover:text-blue-600 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all text-left group"
                    >
                        <item.icon className="h-5 w-5 text-neutral-500 group-hover:text-current" />
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-current">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}
