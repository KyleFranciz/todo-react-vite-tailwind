import { CenterBox } from "../components/CenterBox";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

export const TodoPage = () => {
  //confirm if the user is logged in so that they can use the todo functionality
  const [user] = useAuthState(auth);

  return (
    <div className=" p-4 transform -translate-y-[-20px] h-full flex justify-center items-center">
      {user ? (
        <CenterBox />
      ) : (
        <h1 className="font-semibold">
          Please <span className="text-green-600 font-bold">login</span> to use
          the all the features.
        </h1>
      )}
    </div>
  );
};
