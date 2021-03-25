import * as Yup from 'yup'
import firebase from 'firebase'
import axios from 'axios'
import { transformYupToFormikError } from '_api/utils'
import { getUrl } from '_api/utils/url'

export const URL = `${getUrl()}/users`

export const SCHEMA = Yup.object().shape({
  id: Yup.number(),
  uid: Yup.string().required(),
  email: Yup.string().trim().required(),
  verified: Yup.bool().required(),
  created_at: Yup.string(),
  updated_at: Yup.string(),
})

export const _firebaseUser = () => {
  return firebase.auth().currentUser
}

export const onAuthStateChanged = (args) => {
  return firebase.auth().onAuthStateChanged(args)
}

export const sendPasswordResetEmail = async (email) => {
  return firebase.auth().sendPasswordResetEmail(email)
}

export const reauthenticate = async (
  email,
  password,
  user = _firebaseUser()
) => {
  return user.reauthenticateWithCredential(
    firebase.auth.EmailAuthProvider.credential(email, password)
  )
}

export const signInWithEmailAndPassword = async (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password)
}

export const createUserWithEmailAndPassword = async (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
}

export const updatePassword = async (password, user = _firebaseUser()) => {
  return user.updatePassword(password)
}

export const sendEmailVerification = async (user = _firebaseUser()) => {
  return user.sendEmailVerification()
}

export const signOut = async () => {
  axios.defaults.headers.common['Authorization'] = ''
  return firebase.auth().signOut()
}

export const validate = async (attrs) => {
  return SCHEMA.validate(attrs, {
    stripUnknown: true,
  }).catch((yupError) => Promise.reject(transformYupToFormikError(yupError)))
}

export const me = async (user = _firebaseUser()) => {
  try {
    const token = await user.getIdToken(true)
    axios.defaults.headers.common['Authorization'] = token

    const response = await axios.get(`${URL}/me`)

    return response.data
  } catch (err) {
    throw new Error('Unable to get current user')
  }
}

export const update = async (attrs) => {
  try {
    const user = await validate(attrs)

    const response = await axios.put(`${URL}/${user.id}`, {
      user,
    })

    return response.data
  } catch (err) {
    throw new Error('Unable to update user')
  }
}

export const verify = async (user) => {
  try {
    if (verified(user)) return user

    await _firebaseUser().reload()
    const firebaseUser = _firebaseUser()
    if (firebaseUser.emailVerified) {
      user = await update({ ...user, verified: true })
    }

    return user
  } catch (err) {
    throw new Error('Unable to verify user')
  }
}

export const verified = (user) => {
  return user && user.verified
}
