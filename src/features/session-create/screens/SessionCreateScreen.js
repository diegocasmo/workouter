import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import {
  getCurrTimeEntry,
  getCompletedAt,
  getRoundsCompleted,
  getStartedAt,
  getTimeEntries,
  getTotalElapsedMs,
  hasStarted,
  init,
  isCompleted,
  resetSession,
  start,
} from '_state/reducers/session'
import { TYPE_EXERCISE_REST, TYPE_ROUND_REST } from '_api/time-entry'
import { StyleSheet } from 'react-native'
import { Container, Content } from 'native-base'
import TopControls from '../components/TopControls'
import BottomControls from '../components/BottomControls'
import WorkoutExercise from '../components/WorkoutExercise'
import WorkoutExerciseRest from '../components/WorkoutExerciseRest'
import WorkoutRoundRest from '../components/WorkoutRoundRest'
import WorkoutStartup from '../components/WorkoutStartup'
import WorkoutCompleted from '../components/WorkoutCompleted'
import { createWorkout } from '_state/reducers/workouts'
import { showError } from '_utils/toast'
import { useGetRoutinesQuery } from '_state/services/routine'
import { findRoutineById } from '_state/selectors/routine'
import { getUser } from '_state/reducers/auth'

const SessionCreateScreen = ({ navigation, route }) => {
  const user = useSelector(getUser)
  const { routine } = useGetRoutinesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      routine: findRoutineById(data, route.params.routineId),
    }),
  })
  const dispatch = useDispatch()
  const started = useSelector(hasStarted)
  const completed = useSelector(isCompleted)
  const timeEntry = useSelector(getCurrTimeEntry)
  const elapsedMs = useSelector(getTotalElapsedMs)
  const started_at = useSelector(getStartedAt)
  const completed_at = useSelector(getCompletedAt)
  const rounds_completed = useSelector(getRoundsCompleted)
  const time_entries = useSelector(getTimeEntries)

  const handleStartupCompleted = () => {
    dispatch(init(routine))
    dispatch(start())
  }

  const handleQuit = () => {
    dispatch(resetSession())
    navigation.navigate('Home')
  }

  const handleCompleteConfirmed = async () => {
    try {
      const workout = {
        completed_at,
        elapsed_ms: elapsedMs,
        rounds_completed,
        routine,
        started_at,
        time_entries,
        uid: user.uid,
      }
      const action = await dispatch(createWorkout(workout))
      unwrapResult(action)
      dispatch(resetSession())
      navigation.navigate('Home')
    } catch (err) {
      showError(err.message)
    }
  }

  const renderTimeEntry = () => {
    switch (timeEntry.type) {
      case TYPE_EXERCISE_REST:
        return <WorkoutExerciseRest />
      case TYPE_ROUND_REST:
        return <WorkoutRoundRest />
      default:
        return <WorkoutExercise />
    }
  }

  if (completed) {
    return (
      <Container>
        <Content padder contentContainerStyle={styles.content}>
          <WorkoutCompleted onConfirm={handleCompleteConfirmed} />
        </Content>
      </Container>
    )
  }

  return (
    <Container>
      {started ? (
        <Content
          padder
          scrollEnabled={false}
          contentContainerStyle={styles.content}
        >
          <TopControls onQuit={handleQuit} />
          {renderTimeEntry()}
          <BottomControls />
        </Content>
      ) : (
        <Content
          padder
          scrollEnabled={false}
          contentContainerStyle={styles.content}
        >
          <WorkoutStartup
            routine={routine}
            onQuit={handleQuit}
            onStartupCompleted={handleStartupCompleted}
          />
        </Content>
      )}
    </Container>
  )
}

export default SessionCreateScreen

SessionCreateScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      routineId: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})