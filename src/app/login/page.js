/* eslint-disable @next/next/no-img-element */
import LoginComponent from "@/components/Login/Login";
export default function Login() {
  return (
    <div className="w-full flex flex-col lg:flex-row h-[80vh] justify-center items-center">
      <div className="mt-8 sm:flex justify-center h-full items-center hidden">
        <img
          src="/images/solarbni_loginpage.png"
          alt="login image"
          className="w-[65%] object-contain"
        />
      </div>
      <div className="w-[90%] sm:w-[50%] p-6 flex flex-col justify-center h-full items-start gap-4">
        <div className="font-bold text-4xl">Login Page</div>
        <LoginComponent />
      </div>
    </div>
  );
}
