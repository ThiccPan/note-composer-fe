import { getAuth } from "firebase/auth"

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, getValidatedUser } = useFirebaseAuth()
  // skip middleware on server
  if (import.meta.server) {
    console.log("serverrrr")
    return
  }
  console.log('inside middleware')

  if (import.meta.client) {
    console.log('on client')
  }

  let a = await getValidatedUser()
  if (!a) {
    console.log('not authenticated')
    return navigateTo('/login')
  } else {
    console.log('user is:', a)
    return
  }
})
