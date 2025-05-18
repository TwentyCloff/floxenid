const stats = [
  { label: "Product Sold", value: "12,345" },
  { label: "Total Customer", value: "8,972" },
  { label: "Undetected Rate", value: "99.9%" },
  { label: "Support Available", value: "24/7" },
];

const CompanyLogos = ({ className }) => {
  return (
    <div className={className}>
      <h5 className="tagline mb-6 text-center text-n-1/50">
        Key Performance Metrics
      </h5>
      <ul className="flex justify-center gap-8 flex-wrap">
        {stats.map(({ label, value }, i) => (
          <li
            key={i}
            className="flex flex-col items-center justify-center flex-1 min-w-[150px] max-w-[220px] h-[110px] rounded-xl 
                       bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                       text-white shadow-lg
                       transform transition-transform duration-300 hover:scale-105 cursor-default"
          >
            <span className="text-3xl font-bold">{value}</span>
            <span className="mt-2 text-sm uppercase tracking-widest">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyLogos;
