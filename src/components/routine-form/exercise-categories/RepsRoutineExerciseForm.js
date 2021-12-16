import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { StyleSheet } from 'react-native'
import { View, Grid, Col } from 'native-base'
import { getIn } from 'formik'
import { IntegerInput, DecimalInput } from '_components/form'
import TimePicker from '_components/routine-form/pickers/TimePicker'
import { getUser } from '_state/reducers/auth'
import { User } from '_api'

const RepsRoutineExerciseForm = ({ bag, disabled }) => {
  const user = useSelector(getUser)
  const { errors, handleBlur, handleChange, touched, values } = bag

  return (
    <View style={styles.container}>
      <Grid>
        <Col flexGrow={1} paddingRight={10}>
          <IntegerInput
            label="Reps"
            value={values.quantity}
            disabled={disabled}
            error={getIn(errors, 'quantity')}
            onBlur={handleBlur('quantity')}
            onChange={handleChange('quantity')}
            touched={getIn(touched, 'quantity')}
          />
        </Col>
        <Col flexGrow={1} paddingRight={10}>
          <DecimalInput
            label={`Weight (${User.getWeightUnitTypeLabel(user)})`}
            value={values.weight}
            disabled={disabled}
            error={getIn(errors, 'weight')}
            onBlur={handleBlur('weight')}
            onChange={handleChange('weight')}
            touched={getIn(touched, 'weight')}
          />
        </Col>
        <Col flexGrow={1}>
          <TimePicker
            label="Rest"
            value={`${values.rest_seconds}`}
            disabled={disabled}
            onChange={handleChange('rest_seconds')}
          />
        </Col>
      </Grid>
    </View>
  )
}

RepsRoutineExerciseForm.propTypes = {
  bag: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
}

export default RepsRoutineExerciseForm

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
})
