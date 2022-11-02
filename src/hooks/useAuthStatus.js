import { useEffect, useState, useRef } from 'react';
//onAuthStateChanged is anytime the state changes, if we go from logged in to not logged in, this will fire off.
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const isMounted = useRef(true); //memory leak issue...doesn't happen in react 18 anymore but we should still do clean up..see doc below for clarification

  useEffect(() => {
    if (isMounted) {
      const auth = getAuth();
      onAuthStateChanged(auth, user => {
        if (user) {
          setLoggedIn(true);
        }
        setCheckingStatus(false);
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  return { loggedIn, checkingStatus };
};

export default useAuthStatus;

//https://stackoverflow.com/questions/65505665/protected-route-with-firebase (protected routes in v6: this custom hook is from this link)

//https://stackoverflow.com/questions/59780268/cleanup-memory-leaks-on-an-unmounted-component-in-react-hooks (Fix memory leak warning)
