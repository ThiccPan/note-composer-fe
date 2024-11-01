import type { addNoteType, updateNoteType } from "~/types/NoteDTO"
import type { Note } from "~/types/types"

const url = "http://localhost:8000/v1"

const fetchNotesReq = async (reqData: {
  token: string
  limit?: number
  order?: "asc" | "desc"
  search?: string
  tagsId?: string[]
  after?: string
  before?: string
}) => {
  const { data, error } = await useFetch<{
    message: string,
    data: Note[]
  }>(`${url}/notes`, {
    method: "get",
    headers: {
      'Authorization': reqData.token
    },
    params: {
      limit: reqData.limit,
      order: reqData.order,
      search: reqData.search,
      tagsId: reqData.tagsId,
      after: reqData.after,
      before: reqData.before,
    }
  })
  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not fetch data from ${url}/notes`,
    })
  }
  console.log('data: ', data.value?.data)
  return data
}

const fetchNoteByIdReq = async (reqData: {
  token: string
  noteId: string
}) => {
  const { data, error } = await useFetch<{
    message: string,
    data: Note
  }>(`${url}/notes/${reqData.noteId}`, {
    method: "get",
    headers: {
      'Authorization': reqData.token
    },
    params: {}
  })
  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not fetch data from ${url}/notes`,
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
  }>(`${url}/notes`, {
    method: "post",
    headers: {
      'Authorization': reqData.token
    },
    body: reqData.addNoteData
  })
  if (error.value) {
    throw createError({
      ...error.value,
      statusMessage: `Could not add data from ${url}/notes`,
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
  }>(`${url}/notes/${reqData.noteId}`, {
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
      statusMessage: `Could not update data from ${url}/notes`,
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
  }>(`${url}/notes/${reqData.noteId}`, {
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