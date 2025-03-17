import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
//import query , collection, where and getDocs
import {
  query,
  where,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
//import db so that i have access to the database
import { db } from "../config/firebase";
import { motion } from "framer-motion";

export default function CompletedPage() {
  //? Create an interface for the tasks added to the list
  interface Tasks {
    id: string;
    index: number;
    text: string;
    complete: boolean; //! Made optional so, add back later to help with compiling the completed task into a list
    userId?: string;
  }

  //Create a useState to store the task data retrieved inside of the state
  const [displayedTasks, setDisplayedTasks] = useState<Tasks[] | null>([]);

  //Authenticate the users access to the page
  const [user] = useAuthState(auth);

  //because the user can be null I have to make sure the user is authenticated before even running the bellow code
  if (user) {
    // store the useId
    const userId = user?.uid;

    //Create a connection to the database to import all the tasks data that is true: ( complete: true )

    const completedTaskQuery = query(
      collection(db, "completed-collection"),
      where("complete", "==", true),
      where("userId", "==", userId)
    ); //check the completed-collection database and filter out the tasks that are true: ( complete: true ) so that they can be displayed on the screen

    //Create task query that doesnt ==

    //create a const to house the data that we retrieve from the collection and store it in the const so that it can be displayed
    const getCompletedTasks = async () => {
      try {
        //use get docs to fetch all the documents from the collection
        const data = await getDocs(completedTaskQuery);
        setDisplayedTasks(
          data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Tasks[]
        ); // all the documents will be stored in the state
      } catch (error) {
        console.log(error);
      }
    };

    getCompletedTasks();
    //useEffect(() => {
    //  getCompletedTasks();
    //}, []);
  }

  //Create a function that clears the task from the list as well as removes it from the database:
  const clearComplete = (docId: string) => {
    // plug in the connection to the database in the delete function
    // Just deleting one document from the database
    deleteDoc(doc(db, "completed-collection", docId)); // pass the paramerter into the function. should be able to pass the document id into the function to delete the document
  };

  //if the user is not logged in, then display the message "You cannot access this page until you login"
  if (!user) {
    return <div>You cannot access this page until you login</div>;
  } else {
    return (
      <div className="flex flex-col mt-14">
        <p className="text-[2rem] font-extrabold font-inter mb-5">
          COMPLETED TASKS
        </p>
        {/*Create a container for the completed tasks to be diaplayed */}
        <div>
          <div>
            {displayedTasks?.map((tasks) =>
              //if there is are tasks then then display the block
              tasks.text ? (
                //Display the tasks text to the user so they can see a list of all the tasks they completed

                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-[#313131] w-[800px] h-[60px] text-white rounded-2xl mt-[8px] flex justify-center items-center font-bold relative"
                >
                  <li className="list-none">{tasks.text}</li>
                  <button
                    className="absolute right-6 bg-[#161616] px-4.5 py-[4px] rounded-[5px]"
                    onClick={clearComplete(tasks.id)}
                  >
                    clear
                  </button>
                </motion.div>
              ) : (
                //if there are no task then display nothing
                ""
              )
            )}
          </div>
        </div>
      </div>
    );
  }
}
