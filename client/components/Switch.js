import { useState, useEffect } from "react";

export default function Switch({label, purposes, setPurposes}) {
  const [toggle, setToggle] = useState(false);
  const toggleClass = " transform translate-x-5";

  useEffect(() => {
    if(toggle) {
      setPurposes([...purposes, label])
    } else {
      setPurposes(purposes.filter(purpose => purpose !== label))
    }
  }, [toggle]);

  return (
    <>
      <div className="flex flex-row w-[11rem] mr-5 items-center ">
        <div
          className="md:w-[3.25rem] md:h-7 w-12 h-6 flex items-center bg-gray-400 rounded-full p-1 cursor-pointer"
          onClick={() => {
            setToggle(!toggle);
           
          }}
        >
          <div
            className={
              "bg-black md:w-6 md:h-6 h-5 w-5 rounded-full shadow-md transform duration-300 ease-in-out" +
              (!toggle ? null : toggleClass)
            }
          >
          </div>
        </div>
        <label className={`form-check-label ml-2 inline-block text-gray-800 ${toggle && "font-semibold"}`} >{label}</label>
      </div>
    </>
  );
}