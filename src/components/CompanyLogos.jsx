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
            text-white
            font-semibold
            cursor-default
            select-none
            py-4 px-6
            border-2
            rounded-xl
            transition
            flex flex-col items-center justify-center
            w-[150px] h-[100px]
          "
          style={{
            borderImageSlice: 1,
            borderImageSource:
              "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
            borderImageWidth: 1,
            borderImageOutset: 0,
            borderImageRepeat: "stretch",
            borderStyle: "solid",
            background: "none",
          }}
        >
          <span className="text-2xl font-bold">{stat.value}</span>
          <span className="text-sm mt-1">{stat.label}</span>
        </li>
      ))}
    </ul>
  );
};

export default CompanyLogos;
