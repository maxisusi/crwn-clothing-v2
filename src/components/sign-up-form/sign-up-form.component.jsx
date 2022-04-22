import { useState } from 'react';
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from '../../utils/firebase/firebase.utils';
import Button from '../button/button.component';
import FormInput from '../form-input/form-input.component';
import './sign-up-form.styles.scss';
const defaultFormFields = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('passwords do not match');
      setFormFields({ ...formFields, password: '', confirmPassword: '' });
      return;
    }
    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      await createUserDocumentFromAuth(user, { displayName });

      // Reset form
      setFormFields(defaultFormFields);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Cannot create userm email already in use');
      } else {
        console.error('User creation encountered and error', error);
      }
    }
  };
  return (
    <div className='sign-up-container'>
      <h2>Don't gave an account ?</h2>
      <span>
        <h2>Sign up wih your email and password</h2>
      </span>
      <form
        onSubmit={(event) => {
          handleSubmit(event);
        }}>
        <FormInput
          label={'Display Name'}
          onChange={handleChange}
          name='displayName'
          value={displayName}
          type='text'
          required
        />

        <FormInput
          label={'Email'}
          onChange={handleChange}
          name='email'
          value={email}
          type='email'
          required
        />

        <FormInput
          label={'Password'}
          onChange={handleChange}
          name='password'
          value={password}
          type='password'
          required
        />

        <FormInput
          label={'Confirm Password'}
          onChange={handleChange}
          name='confirmPassword'
          value={confirmPassword}
          type='password'
          required
        />

        <Button name='email' type='submit'>
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
