/* eslint-disable @next/next/no-img-element */

export default function Home() {
  return (
    <div className="flex flex-col sm:flex-row sm:-mt-4 mt-20">
      <div className="sm:w-[50%] flex justify-center items-center">
        <div className="hidden sm:flex justify-center items-center h-full">
          <img
            src="/images/solarbni_homepage.png"
            alt="Solarbni homepage"
            className="sm:h-[86vh] h-[20vh]"
          />
        </div>
      </div>
      <div className="sm:w-[50%] p-6 flex flex-col overflow-hidden -mt-16 sm:-mt-0">
        <div className="font-bold text-5xl mt-12">
          Welcome to Solar National Service Portal…
        </div>
        <div className="mt-[10%] text-2xl">
          <div>
            This initiative, spearheaded by Solar BNI, addresses critical
            communication challenges within the Solar service industry.
          </div>
          <br />
          <div>
            The development of this portal aims to enhance interactions between
            contractors and manufacturers, fostering greater clarity,
            transparency, and efficiency. By mitigating communication gaps and
            minimizing time wastage, we strive to improve the overall
            effectiveness of your operations.
          </div>
        </div>
      </div>
    </div>
  );
}
