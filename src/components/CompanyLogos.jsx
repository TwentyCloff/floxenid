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
            transition
          "
          style={{
            borderImageSlice: 1,
            borderImageSource:
              "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
            borderImageWidth: 1,
            borderImageOutset: 0,
            borderImageRepeat: "stretch",
            borderStyle: "solid",
          }}
        >
          {stat.label}
        </li>
      ))}
    </ul>
  );
};

export default CompanyLogos;
