const stats = [
  { label: "Product Sold" },
  { label: "Total Customer" },
  { label: "Undetected Rate" },
  { label: "Support Available" },
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
            py-2 px-4
            border-2
            rounded-lg
            border-transparent
            bg-none
            bg-clip-border
            transition
            hover:border-gradient-to-r
            hover:from-indigo-500
            hover:via-purple-500
            hover:to-pink-500
          "
          style={{
            borderImageSlice: 1,
            borderImageSource:
              "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
          }}
        >
          {stat.label}
        </li>
      ))}
    </ul>
  );
};

export default CompanyLogos;
