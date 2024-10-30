export type Note = {
  id: string,
  title: string,
  content: string,
  tags: string[],
  createdAt: Date,
  updatedAt: Date
}

export type Tag = {
  id: string;
  description?: string;
}