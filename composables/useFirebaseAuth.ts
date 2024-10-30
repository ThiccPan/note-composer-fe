import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, type Auth, type User } from "firebase/auth"

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
    if (firebaseUser.value) {
      console.log("user already authenticated")
      return firebaseUser.value
    }
    return new Promise<User>((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe()
        if (user) {
          firebaseUser.value = user
          firebaseUser.value.getIdToken()
            .then((token) => {
              userToken.value = token
              console.log("token is set")
            })
          resolve(user)
        }
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
      const { data, error } = await useFetch('http://localhost:8000/v1/users/register', {
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
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in 
        const userCreds = userCredential.user;
        const userToken = await userCreds.getIdToken()

        console.log("old user token: ", userToken)

        // get user profile data from the backend service
        interface APIBody {
          /* properties defined here */
          message: string
          data: {
            email: string
            id: string,
            username: string
          }
        }
        const { data, error } = await useFetch<APIBody>('http://localhost:8000/v1/users', {
          method: "get",
          headers: {
            "Authorization": userToken
          }
        })
        if (error.value) {
          throw Error('failed to fetch user data')
        }
        console.log(data.value)
        updateProfile(userCreds, { displayName: data.value!.data.username })
        firebaseUser.value = userCreds
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("error signing in", errorCode, errorMessage)
      });

  }

  return {
    user: firebaseUser,
    userToken,
    registerUser,
    loginUser,
    initUser,
    getValidatedUser,
  }
}
