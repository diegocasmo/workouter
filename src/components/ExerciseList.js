import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet } from 'react-native'
import { unwrapResult } from '@reduxjs/toolkit'
import { Content, Spinner, Text, View } from 'native-base'
import { getUser } from '_state/reducers/auth'
import {
  createExercise,
  destroyExercise,
  updateExercise,
} from '_state/reducers/exercises'
import { showError } from '_utils/toast'
import SearchForm from '_components/SearchForm'
import ExerciseItem from '_features/exercise-list/components/ExerciseItem'
import ExerciseForm from '_features/exercise-list/components/ExerciseForm'
import { DEFAULT_EXERCISE, isExerciseFromSeed } from '_api/exercise'

const ExerciseList = ({
  exercises,
  fetching,
  onPress,
  onQueryChange,
  query,
}) => {
  const dispatch = useDispatch()
  const user = useSelector(getUser)
  const initialState = { visible: false, exercise: DEFAULT_EXERCISE }
  const [state, setState] = useState(initialState)

  const handleCreate = () => {
    setState({ ...state, visible: true })
  }

  const handlePress = (exercise) => {
    // Delegate to parent if prop is defined
    if (onPress) return onPress(exercise)

    // Otherwise assume it's an update
    handleUpdate(exercise)
  }

  const handleUpdate = (exercise) => {
    // Only non-seed exercises can be updated
    if (isExerciseFromSeed(exercise)) return

    setState({ ...state, visible: true, exercise })
  }

  const handleDestroy = async (exercise) => {
    try {
      const action = await dispatch(
        destroyExercise({ uid: user.uid, ...exercise })
      )
      unwrapResult(action)
    } catch (err) {
      showError(err.message)
    }
  }

  const handleCancel = () => {
    setState(initialState)
  }

  const handleSubmit = async (exercise) => {
    setState(initialState)
    try {
      const attrs = { uid: user.uid, ...exercise }
      const action = await dispatch(
        exercise.createdAt ? updateExercise(attrs) : createExercise(attrs)
      )
      unwrapResult(action)
      setState(initialState)
    } catch (err) {
      showError(err.message)
    }
  }

  const noMatches = exercises.length === 0 && query.trim() !== ''
  const noExercises = exercises.length === 0 && query.trim() === ''

  return (
    <Content
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      enableResetScrollToCoords={false}
    >
      <SearchForm
        style={styles.searchForm}
        btnText="+ Exercise"
        query={query}
        onChangeText={onQueryChange}
        onCreate={handleCreate}
      />
      {fetching ? (
        <Spinner color="black" />
      ) : (
        <View>
          {noExercises && <Text>There are no exercises to show</Text>}
          {noMatches && (
            <Text>We could not find any exercises based on your criteria</Text>
          )}
          {exercises.map((exercise) => (
            <ExerciseItem
              key={exercise.key}
              exercise={exercise}
              onPress={handlePress}
              onUpdate={handleUpdate}
              onDestroy={handleDestroy}
            />
          ))}
          {state.visible && (
            <ExerciseForm
              exercise={state.exercise}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              visible={state.visible}
            />
          )}
        </View>
      )}
    </Content>
  )
}

export default ExerciseList

ExerciseList.propTypes = {
  exercises: PropTypes.array.isRequired,
  fetching: PropTypes.bool.isRequired,
  onPress: PropTypes.func,
  onQueryChange: PropTypes.func.isRequired,
  query: PropTypes.string,
}

const styles = StyleSheet.create({
  content: {
    margin: 10,
    paddingBottom: 25,
  },
  searchForm: {
    marginBottom: 20,
  },
})