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
      <ul className="flex justify-center gap-8 flex-nowrap overflow-x-auto no-scrollbar">
        {stats.map((stat, i) => (
          <li
            key={i}
            className="flex flex-col items-center justify-center flex-shrink-0 min-w-[140px] max-w-[200px] h-[110px] rounded-xl
                       bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                       text-white shadow-lg
                       transform transition-transform duration-300 hover:scale-105 cursor-default
                       px-6 py-4"
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
