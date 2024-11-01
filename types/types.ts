export type Note = {
  id: string,
  title: string,
  content: string,
  tagsId: string[],
  createdAt: Date,
  updatedAt: Date
}

export type Tag = {
  id: string;
  description?: string;
}