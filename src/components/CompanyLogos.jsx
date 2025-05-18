const stats = [
  { label: "Product Sold", value: "1,234" },
  { label: "Total Customer", value: "567" },
  { label: "Undetected Rate", value: "99.9%" },
  { label: "Support Available", value: "24/7" },
];

const CompanyLogos = () => {
  return (
    <ul className="flex gap-6 justify-center flex-wrap px-2">
      {stats.map((stat, i) => (
        <li
          key={i}
          className="
            flex flex-col items-center
            text-white
            font-semibold
            cursor-default
            select-none
            py-4 px-6
            rounded-lg
            border-2
            border-transparent
            bg-none
            bg-clip-border
          "
          style={{
            borderImageSlice: 1,
            borderImageSource:
              "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
          }}
        >
          <p className="text-3xl font-bold">{stat.value}</p>
          <p className="mt-2 text-sm">{stat.label}</p>
        </li>
      ))}
    </ul>
  );
};

export default CompanyLogos;
