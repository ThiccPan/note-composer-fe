import type { addNoteType, updateNoteType } from "~/types/NoteDTO"
import type { Note } from "~/types/types"

const url = "http://localhost:8000/v1/notes"

const fetchNotesReq = async (reqData: {
  token: string
  limit?: number
  order?: "asc" | "desc"
  search?: string
}) => {
  const { data, error } = await useFetch<{
    message: string,
    data: Note[]
  }>(url, {
    method: "get",
    headers: {
      'Authorization': reqData.token
    },
    params: {
      limit: reqData.limit,
      order: reqData.order,
      search: reqData.search,
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

const fetchNoteByIdReq = async (reqData: {
  token: string
  noteId: string
}) => {
  const { data, error } = await useFetch<{
    message: string,
    data: Note
  }>(`${url}/${reqData.noteId}`, {
    method: "get",
    headers: {
      'Authorization': reqData.token
    },
    params: {}
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
  console.log("added data: ", data)
  return data
}

const updateNoteReq = async (reqData: {
  token: string
  noteId: string
  updateNoteData: updateNoteType
}) => {
  console.log("updating note", reqData.noteId)
  const { data, error } = await useFetch<{
    message: string,
  }>(`${url}/${reqData.noteId}`, {
    method: "put",
    headers: {
      'Authorization': reqData.token
    },
    body: reqData.updateNoteData
  })
  console.log("ret data:", data)
  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not update data from ${url}`,
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

export { fetchNotesReq, fetchNoteByIdReq, addNoteReq, updateNoteReq, deleteNoteReq }