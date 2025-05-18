const stats = [
  { label: "Product Sold", value: "1,234" },
  { label: "Total Customer", value: "567" },
  { label: "Undetected Rate", value: "99.9%" },
  { label: "Support Available", value: "24/7" },
];

const CompanyLogos = () => {
  return (
    <div className="w-full px-4 py-12">
      <h5 className="text-center text-white/50 mb-6">
        Helping people create beautiful content at
      </h5>
      <ul className="flex flex-wrap justify-center gap-6">
        {stats.map((stat, i) => (
          <li
            key={i}
            className="text-white text-center px-6 py-4 rounded-2xl border"
            style={{
              borderWidth: "2px",
              borderStyle: "solid",
              borderImageSource:
                "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
              borderImageSlice: 1,
              background: "none",
              backgroundClip: "padding-box",
              WebkitBackgroundClip: "padding-box",
              MozBackgroundClip: "padding-box",
            }}
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
