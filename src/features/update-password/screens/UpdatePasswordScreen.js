import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Container, Content } from 'native-base'
import UpdatePasswordForm from '../components/UpdatePasswordForm'
import { showError, showSuccess } from '../../../utils/toast'
import { updatePassword } from '../../../api/update-password'
import { currentUser } from '../../../api/current-user'

const UpdatePasswordScreen = ({ navigation }) => {
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const handleUpdatePassword = async ({ newPassword }) => {
    setIsUpdatingPassword(true)
    try {
      const user = currentUser()
      await updatePassword(user, newPassword)
      showSuccess('Your password has been successfully updated')
      navigation.popToTop()
    } catch (err) {
      showError(err.message)
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <Container>
      <Content padder>
        <UpdatePasswordForm
          style={styles.form}
          onSubmit={handleUpdatePassword}
          isSubmitting={isUpdatingPassword}
        />
      </Content>
    </Container>
  )
}

UpdatePasswordScreen.navigationOptions = {
  title: 'Update Password',
}

UpdatePasswordScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default UpdatePasswordScreen

const styles = StyleSheet.create({
  form: {
    width: '100%',
    alignItems: 'center',
  },
})