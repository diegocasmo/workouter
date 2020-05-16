import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Button, Col, Form, Grid, H1, Spinner, Text, View } from 'native-base'
import { Formik, getIn, FieldArray } from 'formik'
import { TextInput, NumberInput } from '../../../components/form'
import ExerciseForm from './ExerciseForm'
import { EMPTY_WORKOUT, SCHEMA } from '../../../api/models/workout'

const WorkoutForm = ({ isSubmitting, onSubmit, style }) => {
  return (
    <Formik
      initialValues={EMPTY_WORKOUT}
      validationSchema={SCHEMA}
      onSubmit={(attrs) => {
        onSubmit(SCHEMA.cast(attrs))
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        touched,
        errors,
      }) => {
        const isValid = Object.keys(errors).length === 0

        return (
          <Form style={style}>
            <View>
              <H1 style={styles.h1}>Setup</H1>

              <Grid>
                <Col>
                  <TextInput
                    label="Title"
                    autoFocus={true}
                    error={getIn(errors, 'title')}
                    onBlur={handleBlur('title')}
                    onChange={handleChange('title')}
                    touched={getIn(touched, 'title')}
                    value={values.title}
                  />
                </Col>
              </Grid>
              <Grid>
                <Col paddingRight={10}>
                  <NumberInput
                    error={getIn(errors, 'rounds')}
                    onBlur={handleBlur('rounds')}
                    onChange={handleChange('rounds')}
                    touched={getIn(touched, 'rounds')}
                    value={values.rounds}
                    label="Rounds"
                  />
                </Col>
                <Col>
                  <NumberInput
                    error={getIn(errors, 'restSeconds')}
                    onBlur={handleBlur('restSeconds')}
                    onChange={handleChange('restSeconds')}
                    touched={getIn(touched, 'restSeconds')}
                    value={values.restSeconds}
                    label="Round rest (sec)"
                  />
                </Col>
              </Grid>
            </View>

            <FieldArray name="exercises" component={ExerciseForm} />

            <Button
              block
              primary
              style={styles.submitBtn}
              disabled={isSubmitting || !isValid}
              onPress={handleSubmit}
            >
              {isSubmitting ? (
                <Spinner color="white" size="small" />
              ) : (
                <Text>Create</Text>
              )}
            </Button>
          </Form>
        )
      }}
    </Formik>
  )
}

WorkoutForm.propTypes = {
  style: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
}

export default WorkoutForm

const styles = StyleSheet.create({
  h1: {
    marginBottom: 10,
  },
  submitBtn: {
    marginTop: 20,
  },
})
