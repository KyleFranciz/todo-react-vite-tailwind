import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
//import query , collection, where and getDocs
import {
  query,
  where,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
//import db so that I have access to the database
import { db } from "../config/firebase";
import { motion } from "framer-motion";

//Define the prop that is going to be passed into the function

export const CompletedPage = () => {
  //? Create an interface for the tasks added to the list
  interface Tasks {
    docId: string;
    index: number;
    text: string;
    complete: boolean; //! Made optional so, add back later to help with compiling the completed task into a list
    userId?: string;
  }

  //Create a useState to store the task data retrieved inside of the state
  const [displayedTasks, setDisplayedTasks] = useState<Tasks[]>([]);

  //Authenticate the users access to the page
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    //because the user can be not logged in I have to make sure the user is authenticated before even running the bellow code
    if (user) {
      // store the useId
      const userId = user?.uid;

      //Create a connection to the database to import all the task data that is true: (complete: true)

      const completedTaskQuery = query(
        collection(db, "completed-collection"),
        where("complete", "==", true),
        where("userId", "==", userId)
      ); //check the completed-collection database and filter out the tasks that are true: (complete: true) so that they can be displayed on the screen

      //Create task query that doesnt ==

      //create a const to house the data that we retrieve from the collection and store it in the const so that it can be displayed
      const getCompletedTasks = async () => {
        //use get docs to fetch all the documents from the collection
        const docData = await getDocs(completedTaskQuery);
        try {
          setDisplayedTasks(
            docData.docs.map((doc) => ({
              ...doc.data(),
              docId: doc.id,
            })) as Tasks[]
          ); // all the documents will be stored in the state
          console.log(displayedTasks.forEach((doc) => doc));
        } catch (error) {
          console.log(error);
        }
      };

      getCompletedTasks();
    }
  }, [user]);

  //Create a function that clears the task from the list as well as removes it from the database:
  const deleteCompletedTask = async (docId: string) => {
    //make a try catch block to make the attempt:
    try {
      //use the deleteDoc function to search through and find the doc to delete
      //pass in the docid from the feteched documents and the individual documents id
      await deleteDoc(doc(db, "completed-collection", docId));

      //create a function to delete the task from the list:
      setDisplayedTasks((prevTask) =>
        prevTask.filter((task) => task.docId !== docId)
      );

      console.log("Completed Task has been cleared");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    <div>Loading...</div>;
  }

  //if the user is not logged in, then display the message "You cannot access this page until you login"
  if (user) {
    return (
      <div className="flex flex-col mt-14">
        <p className="text-[2rem] font-extrabold font-inter mb-5">
          COMPLETED TASKS
        </p>
        {/*Create a container for the completed tasks to be displayed */}
        <div>
          <div>
            {/*If the length of the displayedTask array is empty then let the user know there are no more tasks */}
            {displayedTasks?.length > 0 ? (
              displayedTasks?.map((tasks) =>
                //if there are tasks then display the block
                tasks.text ? (
                  //Display the task text to the user so they can see a list of all the tasks they completed

                  <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-[#313131] w-[800px] h-[60px] text-white rounded-2xl mt-[8px] flex justify-center items-center font-bold relative"
                  >
                    <li className="list-none">{tasks.text}</li>
                    <button
                      className="absolute right-6 bg-[#161616] px-4.5 py-[4px] rounded-[5px]"
                      onClick={() => deleteCompletedTask(tasks.docId)}
                    >
                      clear
                    </button>
                  </motion.div>
                ) : (
                  //if there is no task then display nothing
                  ""
                )
              )
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-[#313131] w-[800px] h-[60px] text-white rounded-2xl mt-[8px] flex justify-center items-center font-bold relative"
              >
                There are no more completed tasks...
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className=" h-[90vh] transform: translate-y-14 flex justify-center items-center">
        <h1 className="font-semibold">
          You cannot access this page until you{" "}
          <span className="text-green-600 font-bold">login.</span>
        </h1>
      </div>
    );
  }
};
