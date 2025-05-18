const stats = [
  { label: "Product Sold", value: "1,234" },
  { label: "Total Customer", value: "567" },
  { label: "Undetected Rate", value: "99.9%" },
  { label: "Support Available", value: "24/7" },
];

const CompanyLogos = ({ className }) => {
  return (
    <div
      className={`relative w-full py-12 ${className}`}
    >
      {/* Background hitam hanya di bagian kontennya, tidak mengenai garis kiri */}
      <div className="absolute inset-y-0 left-[56px] right-0 bg-[#0a0a0a] -z-10 rounded-l-[1rem]" />

      <div className="max-w-screen-xl mx-auto px-4">
        <h5 className="tagline mb-6 text-center text-white/50">
          Helping people create beautiful content at
        </h5>
        <ul
          className="
            flex 
            gap-6
            overflow-x-auto 
            no-scrollbar
            snap-x snap-mandatory
            scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-transparent
            px-2
            md:overflow-x-visible
            md:justify-center
            md:flex-wrap
          "
        >
          {stats.map((stat, i) => (
            <li
              key={i}
              className="
                flex-shrink-0
                snap-center
                w-[70vw] md:w-[180px]
                h-[120px]
                rounded-2xl
                bg-[#0a0a0a]
                border border-white/10
                text-white
                shadow-md
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
    </div>
  );
};

export default CompanyLogos;
