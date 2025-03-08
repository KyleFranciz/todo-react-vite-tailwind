//import function to login and authorize the user:
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config/firebase";
//import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

export const useGoDestination = (backslash: string) => {
  const navigate = useNavigate();
  return navigate(backslash);
};

//create a function to log the user in:
export const LoginUser = async () => {
  const result = await signInWithPopup(auth, provider);
  console.log(result);
};
//create useAuthState to store the user data
//const [user] = useAuthState(auth);

//useNavigate to go back to the homepage after the login
