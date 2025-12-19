import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export type FieldType = 'text' | 'long_text' | 'multiple_choice' | 'checkbox' | 'dropdown' | 'date' | 'number' | 'email'

export interface FormField {
    _id: string
    type: FieldType
    label: string
    options?: string[] // For MC, Checkbox, Dropdown
    validation?: {
        required?: boolean
        min?: number // For number (value) and text (length)
        max?: number // For number (value) and text (length)
    }
    // Legacy support (optional, but good to keep type definition if we want to be strict about migration)
    required?: boolean
    min?: number
    max?: number
}

interface FormEditorState {
    fields: FormField[]
    title: string
    description: string
    selectedFieldId: string | null
    addField: (type: FieldType) => void
    removeField: (id: string) => void
    updateField: (id: string, updates: Partial<FormField>) => void
    selectField: (id: string | null) => void
    moveField: (activeId: string, overId: string) => void
    setFields: (fields: FormField[]) => void
    setTitle: (title: string) => void
    setDescription: (description: string) => void
}

export const useFormEditorStore = create<FormEditorState>()(
    persist(
        (set) => ({
            fields: [],
            title: 'Untitled Form',
            description: '',
            selectedFieldId: null,
            addField: (type) =>
                set((state) => {
                    const newField: FormField = {
                        _id: uuidv4(),
                        type,
                        label: 'New Question',
                        validation: {
                            required: false
                        },
                        options: ['Option 1', 'Option 2'],
                    }
                    return {
                        fields: [...state.fields, newField],
                        selectedFieldId: newField._id,
                    }
                }),
            removeField: (id) =>
                set((state) => ({
                    fields: state.fields.filter((f) => f._id !== id),
                    selectedFieldId: state.selectedFieldId === id ? null : state.selectedFieldId,
                })),
            updateField: (id, updates) =>
                set((state) => ({
                    fields: state.fields.map((f) => (f._id === id ? { ...f, ...updates } : f)),
                })),
            selectField: (id) => set({ selectedFieldId: id }),
            moveField: (activeId, overId) =>
                set((state) => {
                    const oldIndex = state.fields.findIndex((f) => f._id === activeId)
                    const newIndex = state.fields.findIndex((f) => f._id === overId)
                    const newFields = [...state.fields]
                    const [movedItem] = newFields.splice(oldIndex, 1)
                    newFields.splice(newIndex, 0, movedItem)
                    return { fields: newFields }
                }),
            setFields: (fields) => set({ fields }),
            setTitle: (title) => set({ title }),
            setDescription: (description) => set({ description }),
        }),
        {
            name: 'formhost-storage',
            partialize: (state) => ({ fields: state.fields, title: state.title, description: state.description }), // Only persist fields, title, description
        }
    )
)
