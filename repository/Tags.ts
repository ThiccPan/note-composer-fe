import type { addTagsType } from "~/types/TagsDTO"
import type { Tag } from "~/types/types"

const url = "http://localhost:8000/v1/tags"

export const fetchTagReq = async (queryConfig: {
  token: string
}) => {
  const { data, error } = await useFetch<{
    message: string,
    data: Tag[]
  }>(url, {
    method: "get",
    headers: {
      'Authorization': queryConfig.token
    },
    params: {}
  })
  if (error.value) {
    console.log(error.value.message)
    throw createError({
      ...error.value,
      message: data.value?.message,
      statusMessage: `Could not fetch data from ${url}`,
    })
  }
  return data
}

export const addTagReq = async (reqData: {
  token: string
  id: string
}) => {
  const { data, error } = await useFetch<{
    message: string,
  }>(url, {
    method: "post",
    headers: {
      'Authorization': reqData.token
    },
    body: <addTagsType>{
      id: reqData.id
    },
    params: {}
  })
  if (error.value) {
    console.log(error.value.message)
    throw createError({
      ...error.value,
      message: data.value?.message,
      statusMessage: `Could not save data from ${url}`,
    })
  }
  return data
}

export const deleteTagReq = async (reqData: {
  token: string
  tag: string
}) => {
  const { data, error } = await useFetch<{
    message: string,
  }>(`${url}/${reqData.tag}`, {
    method: "delete",
    headers: {
      'Authorization': reqData.token
    },
  })
  if (error.value) {
    console.log(error.value.message)
    throw createError({
      ...error.value,
      message: data.value?.message,
      statusMessage: `Could not delete data from ${url}/${reqData.tag}`,
    })
  }
  return data
}