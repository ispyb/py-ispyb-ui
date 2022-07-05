import React from 'react';
import { Form, Button, FormControl, Card, FormGroup, FormLabel } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { doSignIn } from 'redux/actions/user';
import UI from 'config/ui';
import ErrorUserMessage from 'components/usermessages/errorusermessage';

function LoginForm(props) {
  const { authenticator } = props;
  const user = useSelector((state) => state.user);
  const { isAuthenticating, isError } = user;
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();

  return (
    <Card style={{ padding: '20px 0 ' }}>
      <Form
        className="container-fluid"
        onSubmit={handleSubmit((data) => {
          dispatch(doSignIn(authenticator, data.username, data.password));
        })}
      >
        {UI.loginForm.header && (
          <p className="text-info" style={{ textAlign: 'left' }}>
            {UI.loginForm.header}
          </p>
        )}
        {isError && <ErrorUserMessage text="Authentication Failed" />}

        <FormGroup controlId="username">
          <FormLabel>{UI.loginForm.usernameLabel}</FormLabel>
          <FormControl {...register('username', { required: true })} type="text" name="username" autoFocus required />
        </FormGroup>

        <FormGroup controlId="password">
          <FormLabel>Password</FormLabel>
          <FormControl {...register('password', { required: true })} type="password" name="password" required />
        </FormGroup>

        <Button style={{ marginTop: 5, width: '100%' }} type="submit" variant="primary">
          {isAuthenticating ? (
            <FontAwesomeIcon className="fa-spin" icon={faSpinner} style={{ marginRight: 10 }}></FontAwesomeIcon>
          ) : (
            <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: 10 }}></FontAwesomeIcon>
          )}
          {isAuthenticating ? 'Signing in...' : 'Sign in'}
        </Button>
      </Form>
    </Card>
  );
}

export default LoginForm;
