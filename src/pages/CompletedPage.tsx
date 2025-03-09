import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function CompletedPage() {
  //Authenticate the users access to the page
  const [user] = useAuthState(auth);

  return (
    <div className=" p-4 transform -translate-y-[-20px] h-full flex justify-center items-center">
      {user ? (
        <div className="text-black">This is the completed task page</div>
      ) : (
        <div>You cannot access this page until you login</div>
      )}
    </div>
  );
}
