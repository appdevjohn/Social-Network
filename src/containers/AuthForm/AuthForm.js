import { useState, useEffect } from 'react';
import { withRouter, Link, Switch, Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import api from '../../api';
import * as authActions from '../../store/actions/auth';
import TextInput from '../../components/TextInput/TextInput';
import SubmitButton from '../../components/SubmitButton/SubmitButton';
import Button from '../../components/Button/Button';
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';

import classes from './AuthForm.module.css';

const SignUp = props => {
    const token = useSelector(state => state.auth.token);
    const activated = useSelector(state => state.auth.activated);
    const isLoading = useSelector(state => state.auth.loading);
    const authError = useSelector(state => state.auth.error);
    const redirectPath = useSelector(state => state.auth.redirectPath);
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmationNum, setConfirmationNum] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');

    const { history } = props;
    const { pathname } = history.location;

    useEffect(() => {
        if (token && activated) {
            history.replace(redirectPath);
        } else if (token && !activated) {
            history.replace('/auth/confirm-email');
        } else if (!token && !activated) {
            history.replace('/auth/login');
        }
    }, [token, activated, history, redirectPath]);

    useEffect(() => {
        if (pathname === '/auth/logout') {
            dispatch(authActions.startLogOut());
        }
        dispatch(authActions.clearError());
        setPassword('');
        setConfirmPassword('');
        setConfirmationNum('');
    }, [pathname, dispatch])

    const onSignUp = () => {
        dispatch(authActions.startSignUp(firstName, lastName, email, username, password, confirmPassword));
    }

    const onLogIn = () => {
        dispatch(authActions.startLogIn(email, password));
    }

    const onConfirmEmail = () => {
        dispatch(authActions.startConfirmEmail(token, confirmationNum));
    }

    const onReConfirmEmail = () => {
        api.put('/auth/resend-verification-code', null, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            dispatch(authActions.setError(response.data.message || 'A new verification code has been sent.'));
        }).catch(error => {
            dispatch(authActions.setError(error.response?.data?.message || 'There was an error sending a new verification code.'));
        })
    }

    const onGoBackFromConfirmEmail = () => {
        dispatch(authActions.startLogOut());
    }

    const onRequestNewPassword = () => {

    }

    const onResetPassword = () => {

    }

    return (
        <div className={classes.SignUp}>
            <Route path={['/auth/signup', '/auth/login']} exact>
                <TextInput type="email" placeholder="email" value={email} onChange={event => setEmail(event.target.value)} />
                <TextInput type="password" placeholder="password" value={password} onChange={event => setPassword(event.target.value)} />
            </Route>
            <Switch>
                <Route path="/auth/signup" exact>
                    <TextInput type="password" placeholder="confirm password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} />
                    <TextInput type="text" placeholder="first name" value={firstName} onChange={event => setFirstName(event.target.value)} />
                    <TextInput type="text" placeholder="last name" value={lastName} onChange={event => setLastName(event.target.value)} />
                    <TextInput type="text" placeholder="username" value={username} onChange={event => setUsername(event.target.value)} />
                    <SubmitButton title="Sign Up" onClick={onSignUp} />
                    <Link to="/auth/login" className={classes.alternateModeLink}>or Log In</Link>
                </Route>
                <Route path="/auth/login" exact>
                    <SubmitButton title="Log In" onClick={onLogIn} />
                    <Link to="/auth/signup" className={classes.alternateModeLink}>or Sign Up</Link>
                </Route>
                <Route path="/auth/confirm-email" exact>
                    <TextInput type="text" placeholder="Verification Code" value={confirmationNum} onChange={event => setConfirmationNum(event.target.value)} />
                    <SubmitButton title="Confirm" onClick={onConfirmEmail} />
                    <div className={classes.verificationOptionsContainer}>
                        <Button title="Re-Send Code" onClick={onReConfirmEmail} />
                        <Button title="Go Back" onClick={onGoBackFromConfirmEmail} />
                    </div>
                </Route>


                <Route path="/auth/request-new-password" exact>
                    <TextInput type="email" placeholder="email" value={email} onChange={event => { }} />
                    <SubmitButton title="Request" onClick={onRequestNewPassword} />
                </Route>
                <Route path="/auth/reset-password" exact>
                    <TextInput type="password" placeholder="email" value={email} onChange={event => { }} />
                    <SubmitButton title="Reset Password" onClick={onConfirmEmail} />
                    <Button title="Re-Send Code" onClick={onResetPassword} />
                </Route>


                <Route>
                    <Redirect to="/auth/login" />
                </Route>
            </Switch>
            <p>{authError}</p>
            {isLoading ? <LoadingIndicator /> : null}
        </div>
    )
}

export default withRouter(SignUp);