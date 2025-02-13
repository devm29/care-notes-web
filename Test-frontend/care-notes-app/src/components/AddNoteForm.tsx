"use client"

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { AppDispatch } from '../app/store'
import { addNote } from '../features/careNotes/careNotesThunks'

export function AddNoteForm() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [formData, setFormData] = useState({
    patient_id: '',
    category: 'observation' as const,
    priority: 3 as const,
    created_by: '',
    note_content: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await dispatch(addNote({
        ...formData,
        tenant_id: 1, // Default tenant
        facility_id: 1, // Default facility
      })).unwrap()

      router.push('/')
    } catch (error) {
      console.error('Failed to add note:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="patient_id" className="block text-sm font-medium text-gray-700">
            Patient ID
          </label>
          <input
            type="text"
            id="patient_id"
            value={formData.patient_id}
            onChange={(e) => setFormData(prev => ({ ...prev, patient_id: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'medication' | 'observation' | 'treatment' }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="medication">Medication</option>
            <option value="observation">Observation</option>
            <option value="treatment">Treatment</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="1">1 - Lowest</option>
            <option value="2">2 - Low</option>
            <option value="3">3 - Medium</option>
            <option value="4">4 - High</option>
            <option value="5">5 - Highest</option>
          </select>
        </div>

        <div>
          <label htmlFor="created_by" className="block text-sm font-medium text-gray-700">
            Care Provider Name
          </label>
          <input
            type="text"
            id="created_by"
            value={formData.created_by}
            onChange={(e) => setFormData(prev => ({ ...prev, created_by: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="note_content" className="block text-sm font-medium text-gray-700">
            Care Note
          </label>
          <textarea
            id="note_content"
            value={formData.note_content}
            onChange={(e) => setFormData(prev => ({ ...prev, note_content: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Note'}
          </button>
        </div>
      </div>
    </form>
  )
}
