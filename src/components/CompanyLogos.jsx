const stats = [
  { label: "Product Sold", value: "1,234" },
  { label: "Total Customer", value: "567" },
  { label: "Undetected Rate", value: "99.9%" },
  { label: "Support Available", value: "24/7" },
];

const CompanyLogos = ({ className }) => {
  return (
    <div className={`${className} px-6 overflow-visible`}>
      <h5 className="tagline mb-6 text-center text-n-1/50 font-semibold tracking-wide uppercase">
        Helping people create beautiful content at
      </h5>
      <ul
        className="
          flex
          gap-6
          overflow-x-auto
          no-scrollbar
          flex-nowrap
          px-1
          scrollbar-none
          justify-center
          -mx-1
        "
      >
        {stats.map((stat, i) => (
          <li
            key={i}
            className="
              flex-shrink-0
              w-[160px]
              h-[120px]
              rounded-3xl
              bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600
              text-white
              shadow-xl
              flex flex-col items-center justify-center
              px-8 py-6
              cursor-default
              transition
              duration-300
              ease-in-out
              hover:scale-105
              hover:shadow-[0_15px_30px_rgba(130,90,230,0.6)]
              hover:brightness-110
            "
            style={{ willChange: "transform, box-shadow, filter" }}
          >
            <p className="text-4xl font-extrabold tracking-tight drop-shadow-lg">
              {stat.value}
            </p>
            <p className="mt-3 text-lg font-semibold tracking-wide drop-shadow-md">
              {stat.label}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyLogos;
