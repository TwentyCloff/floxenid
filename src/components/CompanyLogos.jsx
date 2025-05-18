const stats = [
  { label: "Product Sold", value: "1,234" },
  { label: "Total Customer", value: "567" },
  { label: "Undetected Rate", value: "99.9%" },
  { label: "Support Available", value: "24/7" },
];

const CompanyLogos = ({ className }) => {
  return (
    <div className={`${className} px-4 overflow-visible`}>
      <h5 className="tagline mb-6 text-center text-n-1/50 font-semibold tracking-wide uppercase">
        Helping people create beautiful content at
      </h5>
      <div className="w-full flex justify-center">
        <ul
          className="
            flex 
            gap-8
            overflow-x-auto 
            no-scrollbar
            snap-x snap-mandatory
            scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-transparent
            px-2
            md:overflow-x-visible
            md:justify-center
            md:flex-wrap
          "
          style={{ maxWidth: "840px" }}
        >
          {stats.map((stat, i) => (
            <li
              key={i}
              className="
                flex-shrink-0
                snap-center
                w-[70vw] md:w-[200px]
                h-[120px] rounded-2xl
                bg-white/20 backdrop-blur-md
                border border-white/30
                text-white
                shadow-lg
                flex flex-col items-center justify-center
                px-8 py-6
                cursor-default
                transition
                duration-400
                ease-in-out
                hover:scale-[1.07]
                hover:shadow-[0_15px_25px_rgba(130,90,230,0.5)]
                hover:border-indigo-400
                hover:bg-gradient-to-r hover:from-indigo-600/70 hover:via-purple-600/70 hover:to-pink-600/70
              "
              style={{ 
                willChange: "transform, box-shadow, background-color",
              }}
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
    </div>
  );
};

export default CompanyLogos;
