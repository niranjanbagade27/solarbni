/* eslint-disable @next/next/no-img-element */
import RegisterComponent from "@/components/Register/Register";
export default function Login() {
  return (
    <div className="w-full flex flex-row h-screen">
      <div className="w-[50%] flex justify-center h-full items-center">
        <img
          src="/images/login.svg"
          alt="login image"
          className="w-[60%] object-contain"
        />
      </div>
      <div className="w-[50%] p-6 flex justify-center h-full items-center">
        <RegisterComponent />
      </div>
    </div>
  );
}
