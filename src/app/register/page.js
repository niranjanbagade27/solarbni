/* eslint-disable @next/next/no-img-element */
import RegisterComponent from "@/components/Register/Register";
export default function RegisterContractor() {
  return (
    <div className="w-full flex flex-col lg:flex-row mt-16 sm:mt-0 justify-center items-center">
      <div className="w-[95%] sm:w-[60%] p-6 flex justify-center items-center">
        <RegisterComponent />
      </div>
      <div className="w-[40%] flex justify-center items-center hidden sm:block">
        <img
          src="/images/login.svg"
          alt="login image"
          className="w-[60%] object-contain"
        />
      </div>
    </div>
  );
}
