import { z } from "zod";

export const addTagsSchema = z.object({
  id: z.string().min(1),
  description: z.string(),
}).partial({ description: true })
export type addTagsType = z.infer<typeof addTagsSchema>