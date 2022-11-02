import { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth'; //also need to add updateProfile
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase.config'; //getting firebase config
import { updateDoc, doc } from 'firebase/firestore'; //Allow us to update the user in firebase
import { toast } from 'react-toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';

function Profile() {
  const auth = getAuth();
  //this states attach to the buttons that enable the form that allow us to changes user details
  const [changeDetails, setChangeDetails] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  //destructing name and email property from formData
  const { name, email } = formData;

  //Set useNavigate from react-router-dom to a variable in order to use it for logout
  const navigate = useNavigate();

  //logout funciton..auth has a signOut method we can use..then navigate back to home
  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  //this return a promise so we need to async
  //This will actually submit and change the user info in firebase
  const onSubmit = async () => {
    try {
      //check see if current user display name is not equal to the name(what we inputed)
      if (auth.currentUser.displayName !== name) {
        //Where we call the updateProfile (from fb directly) function. Here we update display name in fb
        //breakdown:in the updateProfile function we take the auth.currentUser and update the displayName (which is a value within the auth.currentUser) and update with the name on the form (which is what we inputted)
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        //Update in firestore (this is global data)
        //Create a reference to the document. The document takes in the DB from our config file takes in the collection, which is users, and then the ID, which we can get from off the current user dot uid. Cuz rmb the the ID for the user in the fire store is the same as their ID in the auth. So then we're going to await update doc and that's going to take in the that reference that we just created. And then what we want to update is the name field, and we're just setting name to name like that.
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error('Could not update profile details');
    }
  };

  //function that changes the selected user info. id.target.id:e.target.value..see SignUp for info
  const onChange = e => {
    setFormData(prevState => ({ ...prevState, [e.target.id]: e.target.value }));
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText"> Personal Details </p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              //if changeDetail state is true, then it turn into onSubmit function
              changeDetails && onSubmit();
              //then we set setChangeDetails to not the prevState (true vs false)
              setChangeDetails(prevState => !prevState);
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>

        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>
      </main>
    </div>
  );
}

export default Profile;
