const stats = [
  { label: "Product Sold", value: "1,234" },
  { label: "Total Customer", value: "567" },
  { label: "Undetected Rate", value: "99.9%" },
  { label: "Support Available", value: "24/7" },
];

const CompanyLogos = ({ className }) => {
  return (
    <div className={`${className} px-4 overflow-visible`}>
      <h5 className="tagline mb-6 text-center text-n-1/50">
        Helping people create beautiful content at
      </h5>
      <ul
        className="
          flex 
          gap-6 
          overflow-x-auto no-scrollbar
          snap-x snap-mandatory
          scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent
          px-2
          "
      >
        {stats.map((stat, i) => (
          <li
            key={i}
            className="
              flex-shrink-0
              snap-center
              w-[70vw] md:w-[200px]
              h-[110px] rounded-xl
              bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
              text-white shadow-lg
              flex flex-col items-center justify-center
              px-6 py-4
              cursor-default
              transition-transform duration-300 hover:scale-105
            "
          >
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="mt-2 text-sm font-semibold">{stat.label}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyLogos;
