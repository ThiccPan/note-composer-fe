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