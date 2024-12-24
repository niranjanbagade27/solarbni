/* eslint-disable @next/next/no-img-element */
import RegisterComponent from "@/components/Register/Register";
export default function RegisterContractor() {
  return (
    <div className="w-full flex flex-col lg:flex-row h-[80vh] justify-center items-center">
      <div className="mt-8 sm:flex justify-center h-full items-center hidden w-[35%]">
        <img src="/images/solarbni_loginpage.png" alt="login image" />
      </div>
      <div className="w-[90%] sm:w-[50%] sm:p-6 flex flex-col justify-center h-full items-start gap-4 -mt-20 sm:-mt-16">
        <div className="font-bold text-4xl">Register Page</div>
        <RegisterComponent />
      </div>
    </div>
  );
}
