import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet } from 'react-native'
import { Container, Header, Body, Title, Content } from 'native-base'
import WorkoutForm from '../components/WorkoutForm'
import { getUser } from '../../../state/reducers/auth'
import { showError } from '../../../utils/toast'
import { createWorkout } from '../../../state/reducers/workouts'

const WorkoutFormScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const user = useSelector(getUser)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true)
    try {
      await dispatch(createWorkout(user.uid, values))
      resetForm()
      navigation.navigate('Home')
    } catch (err) {
      showError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container>
      <Header>
        <Body>
          <Title>Create Workout</Title>
        </Body>
      </Header>
      <Content padder showsVerticalScrollIndicator={false}>
        <WorkoutForm
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          style={styles.form}
        />
      </Content>
    </Container>
  )
}

export default WorkoutFormScreen

WorkoutFormScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
})
