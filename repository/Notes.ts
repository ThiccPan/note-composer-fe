import type { addNoteType } from "~/types/NoteDTO"
import type { Note } from "~/types/types"

const url = "http://localhost:8000/v1/notes"

const fetchNoteReq = async (queryConfig: {
  token: string
  limit?: number
  order?: "ASC" | "DESC"
}) => {
  const { data, error } = await useFetch<{
    message: string,
    data: Note[]
  }>(url, {
    method: "get",
    headers: {
      'Authorization': queryConfig.token
    },
    params: {
      limit: queryConfig.limit,
      order: queryConfig.order
    }
  })
  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not fetch data from ${url}`,
    })
  }
  return data
}

const addNoteReq = async (reqData: {
  token: string
  addNoteData: addNoteType
}) => {
  const { data, error } = await useFetch<{
    message: string,
  }>(url, {
    method: "post",
    headers: {
      'Authorization': reqData.token
    },
    body: reqData.addNoteData
  })
  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not add data from ${url}`,
    })
  }
  return data
}

const deleteNoteReq = async (reqData: {
  token: string
  noteId: string
}) => {
  const { data, error } = await useFetch<{
    message: string,
  }>(`${url}/${reqData.noteId}`, {
    method: "delete",
    headers: {
      'Authorization': reqData.token
    },
  })
  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not delete note data`,
    })
  }
  return data
}

export { fetchNoteReq, addNoteReq, deleteNoteReq }