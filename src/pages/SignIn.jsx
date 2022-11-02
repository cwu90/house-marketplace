import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import OAuth from '../components/OAuth';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  //To use the email and password variable, we destructured first
  const { email, password } = formData;

  //Setting useNavigate to a variable before we can use the hook
  const navigate = useNavigate();

  //the function attached to the password/email input. Data will pass as long as the value matches the states data above.
  const onChange = e => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  //function attached to form that auth whether inputed user match database in userCredential
  const onSubmit = async e => {
    e.preventDefault();

    //establishing the user credential (same as signup) and..
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      //..seeing if it matches then nav to home page
      if (userCredential.user) {
        navigate('/');
      }
      //or else catch error (that means user does not match)
    } catch (error) {
      toast.error('Bad User Credentials'); // toastify setup
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />

          <div className="passwordInputDiv">
            <input
              type={showPassword ? 'text' : 'password'}
              className="passwordInput"
              placeholder="Password"
              id="password"
              value={password}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              alt=""
              className="showPassword"
              onClick={() => setShowPassword(prevState => !prevState)}
            />
          </div>

          <Link to="/forgot-password" className="forgotPasswordLink">
            {' '}
            Forgot Password
          </Link>

          <div className="signInBar">
            <p className="signInText">Sign In</p>
            <button className="signInButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>
        <OAuth />
        <Link to="/sign-up" className="registerLink">
          Sign Up Instead
        </Link>
      </div>
    </>
  );
}

export default SignIn;
