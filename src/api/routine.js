import * as Yup from 'yup'
import { transformYupToFormikError } from '_api/utils/yup'
import * as RoutineExercise from '_api/routine-exercise'

export const DEFAULT = {
  name: '',
  rounds: 4,
  rest_seconds: 0,
  exercises: [],
}

export const SCHEMA = Yup.object({
  id: Yup.number(),
  name: Yup.string().trim().required(),
  rounds: Yup.number()
    .transform((v) => (isNaN(v) ? -1 : v))
    .required()
    .positive()
    .min(1),
  rest_seconds: Yup.number()
    .transform((v) => (isNaN(v) ? -1 : v))
    .required()
    .positive()
    .min(0),
  created_at: Yup.string(),
  updated_at: Yup.string(),
  exercises: Yup.array(Yup.object().concat(RoutineExercise.SCHEMA))
    .min(1)
    .required(),
})

export const validate = async (values) => {
  return SCHEMA.validate(values, {
    stripUnknown: true,
  }).catch((yupError) => Promise.reject(transformYupToFormikError(yupError)))
}

export const isPeristed = (routine) => !!routine.created_at

export const getFormattedExercises = (routine) => {
  const names = routine.exercises.map((ex) => ex.name)
  if (names.length === 1) return names

  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}
