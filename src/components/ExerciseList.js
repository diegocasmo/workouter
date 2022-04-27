import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Content, Spinner, Text, View, List } from 'native-base'
import SearchForm from '_components/SearchForm'
import ExerciseItem from '_features/exercise-list/components/ExerciseItem'
import ExerciseForm from '_features/exercise-list/components/ExerciseForm'
import { Exercise } from '_models'
import {
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
  useDestroyExerciseMutation,
} from '_state/services/exercise'
import { showError } from '_utils/toast'

const ExerciseList = ({
  exercises,
  fetching,
  onPress,
  onQueryChange,
  query,
  selected = [],
}) => {
  const selectedMap = selected.reduce(
    (memo, { name }) =>
      memo[name] ? { ...memo, [name]: memo[name] + 1 } : { ...memo, [name]: 1 },
    {}
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const initialState = { visible: false, exercise: Exercise.DEFAULT }
  const [state, setState] = useState(initialState)
  const trimmedQuery = query.trim()

  const [createExercise] = useCreateExerciseMutation()
  const [updateExercise] = useUpdateExerciseMutation()
  const [destroyExercise] = useDestroyExerciseMutation()

  const handlePress = (exercise) => {
    // Delegate to parent if prop is defined
    if (onPress) return onPress(exercise)

    // Otherwise assume it's an update
    handleUpdate(exercise)
  }

  const handlePrefillExercise = () => {
    setState({
      visible: true,
      exercise: { ...Exercise.DEFAULT, name: trimmedQuery },
    })
  }

  const handleUpdate = (exercise) => {
    setState({ visible: true, exercise })
  }

  const handleDestroy = (exercise) => {
    return destroyExercise(exercise.id)
  }

  const handleCancel = () => {
    setState(initialState)
  }

  const handleSubmit = async (exercise) => {
    setIsSubmitting(true)

    try {
      exercise.created_at
        ? await updateExercise(exercise).unwrap()
        : await createExercise(exercise).unwrap()
      setState(initialState)
    } catch (err) {
      showError(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasQuery = trimmedQuery !== ''
  const noMatches = exercises.length === 0 && hasQuery
  const noExercises = exercises.length === 0 && !hasQuery

  return (
    <Content
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      enableResetScrollToCoords={false}
    >
      <SearchForm
        style={styles.searchForm}
        btnText="+ New"
        query={query}
        onChangeText={onQueryChange}
        onCreate={handlePrefillExercise}
      />
      {fetching ? (
        <Spinner color="black" />
      ) : (
        <View>
          {noExercises && <Text>There are no exercises to show</Text>}
          {noMatches && (
            <Text style={styles.noMatchesText}>
              We could not find any exercises based on your criteria
            </Text>
          )}
          <List style={styles.list}>
            {exercises.map((exercise) => (
              <ExerciseItem
                key={exercise.id}
                exercise={exercise}
                onPress={handlePress}
                onUpdate={handleUpdate}
                onDestroy={handleDestroy}
                selectedCount={selectedMap[exercise.name]}
              />
            ))}
          </List>
          {state.visible && (
            <ExerciseForm
              exercise={state.exercise}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
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
  selected: PropTypes.array,
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
  list: {},
  noMatchesText: {
    marginBottom: 20,
  },
})
