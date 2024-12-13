/* eslint-disable @next/next/no-img-element */
import LoginComponent from "@/components/Login/Login";
export default function Login() {
  return (
    <div className="w-full flex flex-col lg:flex-row h-[91vh] justify-center items-center">
      <div className="w-[90%] sm:w-[50%] p-6 flex justify-center h-full items-center">
        <LoginComponent />
      </div>
      <div className="w-[50%] flex justify-center h-full items-center hidden sm:block">
        <img
          src="/images/login.svg"
          alt="login image"
          className="w-[60%] object-contain"
        />
      </div>
    </div>
  );
}
