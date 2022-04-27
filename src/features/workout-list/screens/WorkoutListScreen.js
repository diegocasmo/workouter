import React, { useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { Body, Container, Header, Title, View } from 'native-base'
import WorkoutList from '../components/WorkoutList'
import { useGetWorkoutsQuery } from '_state/services/workout'
import { getWorkouts } from '_state/selectors/workout'
import { MAX_PER_PAGE } from '_models/utils/pagination'

const WorkoutListScreen = () => {
  const [page, setPage] = useState(1)
  const [workouts, setWorkouts] = useState([])
  const {
    data = [],
    isLoading,
    isFetching,
    isError,
  } = useGetWorkoutsQuery(page)

  useEffect(() => {
    if (data.length === 0) return

    setWorkouts((workouts) => getWorkouts([...workouts, ...data]))
  }, [data, setWorkouts])

  const handleFetchMore = () => {
    if (isError || isLoading || isFetching || data.length < MAX_PER_PAGE) return

    setPage((page) => page + 1)
  }

  return (
    <Container>
      <Header>
        <Body>
          <Title>
            Workouts{' '}
            {Boolean(workouts.length) &&
              `(${data.length >= MAX_PER_PAGE ? '+' : ''}${workouts.length})`}
          </Title>
        </Body>
      </Header>
      <View style={styles.content}>
        <WorkoutList
          onEndReached={handleFetchMore}
          isLoading={isLoading || isFetching}
          workouts={workouts}
        />
      </View>
    </Container>
  )
}

export default WorkoutListScreen

const styles = StyleSheet.create({
  content: {
    margin: 10,
  },
})
