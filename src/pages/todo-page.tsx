import { collection, getDocs } from "firebase/firestore";
import { CenterBox } from "../components/CenterBox";
import { db } from "../config/firebase";
import { useState } from "react";

//create an interface to house the neccessary data
export interface DocInfo {
  //make same layout as the firebase interface
  DocId: string;
  index: number;
  text: string;
  complete: boolean; //! Made optional so, add back later to help with compiling the completed task into a list
  userId?: string;
}
//make sure the info matches the doc properties so that it can house the info properly
export const TodoPage = () => {
  //create a use state to house the info from the docs and pass it into the props
  const [grabDocInfo, setGrabDocInfo] = useState<DocInfo[]>([]);

  //use the collections function to make the Ref to the collection so I can get all the docs
  const collectionRef = collection(db, "completed-collection");
  // create a function that uses the getDoc function to get the info from the documents so that I can pass it in the compnent
  const retriveDocs = async () => {
    //use try to get the data from the collection
    try {
      //wait for the data to be retrived before going forward
      const data = await getDocs(collectionRef);
      //map through the data
      setGrabDocInfo(
        data.docs.map((docInfo) => ({
          ...docInfo.data(),
          DocId: docInfo.id,
        })) as DocInfo[] // give data retrieved the same structure as the interface
      );
    } catch (error) {
      console.log(error);
    }
  };

  //might use useEffect to make sure this renders once
  retriveDocs();

  return (
    <div className=" p-4 transform -translate-y-[-20px] h-full flex justify-center items-center">
      <CenterBox info={} />
    </div>
  );
};
