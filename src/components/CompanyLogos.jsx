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
      style={{
        isolation: 'isolate',
        backgroundColor: 'transparent',
        filter: 'none',
        position: 'relative',
        zIndex: 20,
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4">
        <h5 className="tagline mb-6 text-center text-white/50" style={{ filter: 'none' }}>
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
          style={{ filter: 'none' }}
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
                text-white
                flex flex-col items-center justify-center
                px-6 py-4
                cursor-default
                transition-transform duration-300 hover:scale-105
                bg-transparent
                border-none
                shadow-none
              "
              style={{ filter: 'none' }}
            >
              <p className="text-3xl font-bold" style={{ filter: 'none' }}>{stat.value}</p>
              <p className="mt-2 text-sm font-semibold" style={{ filter: 'none' }}>{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CompanyLogos;
