import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Container } from 'native-base'
import RoutineForm from '_components/routine-form/RoutineForm'
import { Routine } from '_api'
import { useRoutines } from '_hooks/use-routines'
import { showError } from '_utils/toast'

const CreateRoutineScreen = ({ navigation, route }) => {
  const { create: createRoutine } = useRoutines()
  const [isCreating, setIsCreating] = useState(false)
  const { name = '' } = route.params

  const handleSubmit = async (attrs, { resetForm }) => {
    setIsCreating(true)

    try {
      const data = await createRoutine(attrs)
      resetForm()
      navigation.navigate('RoutineItem', { routineId: data.id })
    } catch (err) {
      setIsCreating(false)
      showError(err)
    }
  }

  return (
    <Container>
      <RoutineForm
        autoFocus={true}
        routine={{ ...Routine.DEFAULT, name }}
        isSubmitting={isCreating}
        onSubmit={handleSubmit}
      />
    </Container>
  )
}

export default CreateRoutineScreen

CreateRoutineScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
  }).isRequired,
}
