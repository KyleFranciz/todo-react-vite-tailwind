import { WelcomeText } from "../components/WelcomeText";

export default function HomePage() {
  //^ Make the user see different sides of the site uppon logged in /logged out

  return (
    <div className="pt-4 p-4 transform -translate-y-[-20px] flex flex-col items-center z-[-10] ">
      <div className="container mx-auto z-[-5]">
        <div className="mt-[100px] flex flex-col items-center text-black p-4 font-[800] ">
          <div className="text-[.7rem] flex justify-between w-[248px] mb-[-35px]">
            <WelcomeText text="WELCOME" delayMulti={0.1} />
            <WelcomeText text="TO" delayMulti={0.2} />
          </div>
          <div className="flex flex-col w-[605px] text-[1.5rem] z-[-10] ">
            <WelcomeText text="FOCUS" delayMulti={0.25} />
            <WelcomeText text="CENTER." delayMulti={0.35} />
          </div>
        </div>
        <div className=" mt-2.5">Placeholder</div>
      </div>
    </div>
  );
}
