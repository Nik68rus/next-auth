import { useState } from 'react';
import classes from './auth-form.module.css';
import { signIn } from 'next-auth/react';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });

  function inputChangeHandler(evt) {
    setFormData((prevState) => ({
      ...prevState,
      [evt.target.name]: evt.target.value,
    }));
  }

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function signupHandler(evt) {
    evt.preventDefault();
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function loginHandler(evt) {
    evt.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      ...formData,
    });
    console.log(result);
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={isLogin ? loginHandler : signupHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData['email']}
            onChange={inputChangeHandler}
            required
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData['password']}
            onChange={inputChangeHandler}
            required
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
