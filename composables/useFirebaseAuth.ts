import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile, type Auth, type User } from "firebase/auth"

const url = `http://localhost:8000/v1`

export default function () {
  const app = useNuxtApp()
  const auth = app.$auth as Auth
  const firebaseUser = useState<User | null>("authenticated", () => null)
  const userToken = useState<string | null>("userToken", () => null)

  const initUser = (a?: string) => {
    console.log(a)
    const auth = getAuth()
    let unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("onAuthStateChanged called")
      if (user) {
        firebaseUser.value = user
        firebaseUser.value.getIdToken()
          .then((token) => {
            userToken.value = token
            console.log("token is set")
          })
      } else {
        console.log("not authenticated yet")
      }
      unsubscribe()
    })
  };

  const getValidatedUser = async () => {
    console.log('getting validated user')
    if (firebaseUser.value) {
      console.log("user already authenticated")
      return firebaseUser.value
    }
    return new Promise<User | null>((resolve, reject) => {
      console.log('getting user promise')
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe()
        console.log('user is:', user)
        if (user) {
          firebaseUser.value = user
          firebaseUser.value.getIdToken()
            .then((token) => {
              userToken.value = token
              console.log("token is set")
            })
        }
        resolve(user)
      }, reject)
    })
  }

  const registerUser = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      const userCreds = await createUserWithEmailAndPassword(auth, email, password)
      if (!userCreds.user) {
        throw Error('failed to sign up new user')
      }
      firebaseUser.value = userCreds.user
      const userToken = await userCreds.user.getIdToken()
      const { data, error } = await useFetch(`${url}/users/register`, {
        method: "post",
        headers: {
          "Authorization": userToken
        },
        body: {
          email: email,
          username: username
        }
      })
      if (error.value?.statusCode) {
        throw Error('failed to create new user data')
      }
      console.log(data.value)
      return true
    } catch (error: unknown) {
      if (error instanceof Error && auth.currentUser) {
        await auth.currentUser.delete()
      }
      return false
    }
  }

  const loginUser = async (email: string, password: string) => {
    const auth = getAuth();
    // sign in to firebase auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        throw createError({
          ...error.value,
          statusMessage: `error logging in`,
        })
      });

    // Signed in 
    const userCreds = userCredential.user;
    userToken.value = await userCreds.getIdToken()

    // get user profile data from the backend service
    const { data, error } = await useFetch<{
      message: string
      data: {
        email: string
        id: string,
        username: string
      }
    }>(`${url}/users`, {
      method: "get",
      headers: {
        "Authorization": userToken.value
      }
    })
    if (error.value) {
      throw Error('failed to fetch user data')
    }
    console.log('success sending get user profile request')
    updateProfile(userCreds, { displayName: data.value!.data.username })
    firebaseUser.value = userCreds
  }

  const signOutUser = async () => {
    console.log('signing out user')
    const auth = getAuth();
    await signOut(auth).catch((error) => {
      throw createError({
        ...error.value,
        statusMessage: `error signing out user`,
      })
    })
    firebaseUser.value = null
    userToken.value = null
  }

  return {
    user: firebaseUser,
    userToken,
    registerUser,
    loginUser,
    initUser,
    getValidatedUser,
    signOutUser,
  }
}
