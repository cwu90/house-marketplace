import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import OAuth from '../components/OAuth';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  //To use the email and password variable, we destructured first
  const { name, email, password } = formData;

  //Setting useNavigate to a variable before we can use the hook
  const navigate = useNavigate();

  //the function attached to the password/email input. Data will pass as long as the value matches the states data above.
  const onChange = e => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  //onSubmit function (attached to the signup form) create and "register" new user info in firebase
  const onSubmit = async e => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      //Get the user info from here
      const user = userCredential.user;

      //Updating the display name
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      /////////////////ADDING THE USER DATA
      //Here we are copying everything in our 'formData' state
      const formDataCopy = { ...formData };
      //delete the pw cause we dont want that in the database
      delete formDataCopy.password;
      //set the timestamp to the server time stamp
      formDataCopy.timestamp = serverTimestamp();

      //setDoc is whats going update the database and add user to user's collection in Firebase
      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      //Once form has been submitted we redirect back to home
      navigate('/');
    } catch (error) {
      toast.error('Something went wrong with registration');
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
            type="text"
            className="nameInput"
            placeholder="Name"
            id="name"
            value={name}
            onChange={onChange}
          />

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

          <div className="signUpBar">
            <p className="signUpText">Sign Up</p>
            <button className="signUpButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        <OAuth />
        <Link to="/sign-in" className="registerLink">
          Sign In Instead
        </Link>
      </div>
    </>
  );
}

export default SignUp;
