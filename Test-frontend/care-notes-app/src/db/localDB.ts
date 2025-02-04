import type { CareNote } from "../types"
import type PouchDB from "pouchdb-browser"

class LocalDatabase {
  private db: PouchDB.Database | null = null

  private async initDB() {
    if (typeof window === 'undefined') return

    if (!this.db) {
      const PouchDB = (await import('pouchdb-browser')).default
      this.db = new PouchDB("care_notes")
    }
  }

  async getAllNotes(): Promise<CareNote[]> {
    try {
      await this.initDB()
      if (!this.db) return []

      const result = await this.db.allDocs({
        include_docs: true,
        descending: true,
      })

      return result.rows.map((row) => row.doc as CareNote).filter((doc) => doc && doc.residentName)
    } catch (error) {
      console.error("Error fetching notes from local DB:", error)
      return []
    }
  }

  async saveNote(note: CareNote): Promise<void> {
    try {
      await this.initDB()
      if (!this.db) return

      await this.db.put({
        _id: note.id,
        ...note,
      })
    } catch (error) {
      console.error("Error saving note to local DB:", error)
      throw error
    }
  }

  async saveNotes(notes: CareNote[]): Promise<void> {
    try {
      await this.initDB()
      if (!this.db) return

      const docs = notes.map((note) => ({
        _id: note.id,
        ...note,
      }))

      await this.db.bulkDocs(docs)
    } catch (error) {
      console.error("Error saving notes to local DB:", error)
      throw error
    }
  }

  async clearAllNotes(): Promise<void> {
    try {
      await this.initDB()
      if (!this.db) return

      const result = await this.db.allDocs()
      const docsToDelete = result.rows.map((row) => ({
        _id: row.id,
        _rev: row.value.rev,
        _deleted: true,
      }))

      await this.db.bulkDocs(docsToDelete)
    } catch (error) {
      console.error("Error clearing notes from local DB:", error)
      throw error
    }
  }
}

export const localDB = new LocalDatabase()
