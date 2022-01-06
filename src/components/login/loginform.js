import React from 'react';
import { Alert, Form, Button, FormControl, Card, FormGroup, FormLabel } from 'react-bootstrap';
import UI from '../../config/ui';
import ErrorUserMessage from '../usermessages/errorusermessage';
import { useSelector, useDispatch } from 'react-redux';
import { doSignIn } from '../../redux/actions/user';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

function LoginForm(props) {
  const { plugin } = props;
  const user = useSelector((state) => state.user);

  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();

  return (
    <Card className="tab-panel-fix" style={{ padding: '20px 0 ' }}>
      <Form
        className="container-fluid"
        onSubmit={handleSubmit((data) => {
          dispatch(doSignIn(plugin, data.username, data.password));
        })}
      >
        {UI.loginForm.header && (
          <p className="text-info" style={{ textAlign: 'left' }}>
            {UI.loginForm.header}
          </p>
        )}
        {user.error && <ErrorUserMessage text={user.error} />}
        {user.isSessionExpired && <Alert bsStyle="warning">Session expired</Alert>}

        <FormGroup controlId="username">
          <FormLabel>{UI.loginForm.usernameLabel}</FormLabel>
          <FormControl {...register('username', { required: true })} type="text" name="username" autoFocus required />
        </FormGroup>

        <FormGroup controlId="password">
          <FormLabel>Password</FormLabel>
          <FormControl {...register('password', { required: true })} type="password" name="password" required />
        </FormGroup>

        <Button style={{ marginTop: 5, width: '100%' }} type="submit" bsStyle="primary">
          <FontAwesomeIcon icon={faCoffee} style={{ marginRight: 10 }} />
          {user.isAuthenticating ? 'Signing in...' : 'Sign in'}
        </Button>
      </Form>
    </Card>
  );
}

export default LoginForm;

/*
 <Card className="tab-panel-fix" style={{ padding: '20px 0 ' }}>
      <form
        className="container-fluid"
        onSubmit={handleSubmit((data) => {
          dispatch(doSignIn(plugin, data.username, data.password));
        })}
      >
        {UI.loginForm.header && (
          <p className="text-info" style={{ textAlign: 'left' }}>
            {UI.loginForm.header}
          </p>
        )}
        {user.error && <ErrorUserMessage text={user.error} />}
        {user.isSessionExpired && <Alert bsStyle="warning">Session expired</Alert>}

        <FormGroup controlId="username">
          <FormLabel>{UI.loginForm.usernameLabel}</FormLabel>
          <FormControl inputRef={register({ required: true })} type="text" name="username" autoFocus required />
        </FormGroup>

        <FormGroup controlId="password">
          <FormLabel>Password</FormLabel>
          <FormControl inputRef={register({ required: true })} type="password" name="password" required />
        </FormGroup>

        <Button style={{ marginTop: 5, width: '100%' }} type="submit" bsStyle="primary">
          <FontAwesomeIcon icon={faCoffee} style={{ marginRight: 10 }} />
          {user.isAuthenticating ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </Card>
    */
