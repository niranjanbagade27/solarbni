import { Table } from "reactstrap";

/* eslint-disable @next/next/no-img-element */
export default function ContactPage() {
  return (
    <div className="w-full flex flex-col lg:flex-row h-[80vh] justify-center items-center">
      <div className="mt-8 sm:flex justify-center h-full items-center hidden w-[36%]">
        <img src="/images/solarbni_contact.png" alt="login image" />
      </div>
      <div className="w-[90%] sm:w-[40%] sm:p-6 flex flex-col justify-center h-full items-start gap-10 -mt-20 sm:-mt-16">
        <div className="font-bold text-4xl">Contact Us</div>
        <div className="w-full flex flex-col gap-4">
          <Table striped>
            <tbody>
              <tr>
                <td>Contact number</td>
                <td>: +91 7770024466</td>
              </tr>
              <tr>
                <td>Email ID</td>
                <td>: infosolarbni@gmail.com</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
