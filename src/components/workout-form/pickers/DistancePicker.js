import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import ModalSelector from 'react-native-modal-selector'
import { TextInput } from '../../form'
import { DISTANCE_OPTS } from '../../../utils/distance-utils'

const DistancePicker = ({ label, onChange, value, allowNone = true }) => {
  const [visible] = useState(false)

  const handleChange = (option) => {
    onChange(`${option.valueInMeters}`)
  }

  const noop = () => {}

  const findDistanceOpt = (value) => {
    const valueAsInt = parseInt(value, 10)
    return value === 0 || value === '0' || value
      ? DISTANCE_OPTS.find((opt) => opt.valueInMeters === valueAsInt)
      : null
  }

  const selectedOpt = findDistanceOpt(value)

  // Remove 'None' from available options if it's value isn't allowed
  let options = DISTANCE_OPTS
  if (!allowNone) {
    options = options.filter(({ valueInMeters }) => valueInMeters !== 0)
  }

  return (
    <ModalSelector
      data={options.map((opt, idx) => ({ key: idx, ...opt }))}
      visible={visible}
      supportedOrientations={['portrait']}
      cancelText="Cancel"
      animationType="fade"
      onChange={handleChange}
      overlayStyle={styles.overlayStyle}
      optionContainerStyle={styles.optionContainerStyle}
      cancelStyle={styles.cancelStyle}
      optionTextStyle={styles.optionTextStyle}
    >
      <TextInput
        label={label}
        onBlur={noop}
        onChange={noop}
        value={selectedOpt ? selectedOpt.label : null}
      />
    </ModalSelector>
  )
}

export default DistancePicker

DistancePicker.propTypes = {
  allowNone: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
}

const styles = StyleSheet.create({
  overlayStyle: {
    flex: 1,
    paddingTop: 120,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  optionContainerStyle: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 250,
    height: 300,
  },
  cancelStyle: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 250,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  optionTextStyle: {
    color: 'black',
  },
})
