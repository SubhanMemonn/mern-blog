import { Button } from "flowbite-react";

const CallToAction = () => {
  return (
    <div className="flex sm:flex-row flex-col p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center md:gap-9">
      <div className="flex-1 flex flex-col gap-2 justify-center">
        {" "}
        <h1 className="font-semibold md:text-4xl text-2xl">
          The Complete 2024 Web Development
        </h1>
        <p className="text-gray-400 text-sm my-2">
          Become a Full-Stack Web Developer with just ONE course. HTML, CSS,
          Javascript, Node, React, PostgreSQL, Web3 and DApps
        </p>
        <Button gradientDuoTone="purpleToPink" pill className="text-xl">
          <a
            href="https://www.udemy.com/course/the-complete-web-development-bootcamp/?utm_source=adwords&utm_medium=udemyads&utm_campaign=LongTail_la.EN_cc.ROW&utm_content=deal4584&utm_term=_._ag_77879424134_._ad_535397245863_._kw__._de_c_._dm__._pl__._ti_dsa-1007766171312_._li_1011081_._pd__._&matchtype=&gad_source=1&gclid=CjwKCAiA_5WvBhBAEiwAZtCU7_TIm00S1uDyVWjFeCWALy1N4xQ8XyZndVj9dr2mmlE7HF_OFMckohoCUAcQAvD_BwE&couponCode=2021PM25"
            target="blank"
            rel="noopener noreferrer"
          >
            Check Out
          </a>
        </Button>
      </div>
      <div className="flex-1 p-7">
        <img
          src="https://images.unsplash.com/photo-1623479322729-28b25c16b011?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHdlYiUyMGRldmVsb3BlcnxlbnwwfHwwfHx8MA%3D%3D"
          alt=""
        />
      </div>
    </div>
  );
};

export default CallToAction;
