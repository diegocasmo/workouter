import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Body, View, Card, CardItem, H1, Text, Icon } from 'native-base'
import { fromNow } from '_utils/time-utils'
import { getRoutineFormattedExercises } from '_api/routine'
import Duration from '_components/time/Duration'

const WorkoutItem = ({ workout }) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <CardItem header style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            <H1>{workout.routine.name}</H1>
          </Text>
        </CardItem>
        <CardItem>
          <Body>
            <Text numberOfLines={2} style={styles.summary}>
              {getRoutineFormattedExercises(workout.routine)}
            </Text>
            <Text style={styles.rounds}>
              Rounds: {workout.roundsCompleted}/{workout.routine.rounds}
            </Text>
          </Body>
        </CardItem>
        <View style={styles.completedAtContainer}>
          <Icon style={styles.calendarIcon} name="md-calendar" active />
          <Text>{fromNow(workout.completedAt)}</Text>
        </View>
        <View style={styles.durationContainer}>
          <Icon style={styles.durationIcon} name="md-time" active />
          <Duration style={styles.durationText} elapsedMs={workout.elapsedMs} />
        </View>
      </Card>
    </View>
  )
}

export default WorkoutItem

WorkoutItem.propTypes = {
  workout: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 165,
    marginBottom: 5,
  },
  card: {
    height: 165,
    flex: 1,
  },
  header: {
    paddingBottom: 0,
  },
  name: {
    maxWidth: '90%',
  },
  summary: {
    marginBottom: 5,
  },
  rounds: {
    marginBottom: 5,
  },
  completedAtContainer: {
    position: 'absolute',
    bottom: 10,
    left: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  calendarIcon: {
    fontSize: 18,
    marginRight: 5,
  },
  calendarText: {},
  durationContainer: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  durationIcon: {
    fontSize: 18,
    marginRight: 5,
  },
  durationText: {
    fontSize: 16,
    fontWeight: 'normal',
  },
})
