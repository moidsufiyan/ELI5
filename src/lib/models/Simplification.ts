import mongoose, { Schema, Document } from 'mongoose'

export interface ISimplification extends Document {
  original_text: string
  simplified_text: string
  level: string
  used_wiki: boolean
  wiki_title?: string
  timestamp: Date
}

const SimplificationSchema: Schema = new Schema({
  original_text: { type: String, required: true },
  simplified_text: { type: String, required: true },
  level: { type: String, required: true },
  used_wiki: { type: Boolean, default: false },
  wiki_title: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
})


export default mongoose.models.Simplification || mongoose.model<ISimplification>('Simplification', SimplificationSchema)
