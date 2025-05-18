import { useRef, useEffect } from "react";

const stats = [
  { label: "Product Sold", value: "1,234" },
  { label: "Total Customer", value: "567" },
  { label: "Undetected Rate", value: "99.9%" },
  { label: "Support Available", value: "24/7" },
];

const CompanyLogos = ({ className }) => {
  const listRef = useRef(null);
  const scrollPos = useRef(0);
  const scrolling = useRef(true);

  useEffect(() => {
    const ul = listRef.current;
    if (!ul) return;

    const maxScroll = ul.scrollWidth - ul.clientWidth;
    const step = 1; // pixel per interval
    const intervalTime = 20; // ms

    const interval = setInterval(() => {
      if (!scrolling.current) return; // pause if hover

      scrollPos.current += step;
      if (scrollPos.current >= maxScroll) {
        scrollPos.current = 0;
      }
      ul.scrollTo({ left: scrollPos.current, behavior: "smooth" });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${className} px-4 overflow-visible`}>
      <h5 className="tagline mb-6 text-center text-n-1/50">
        Helping people create beautiful content at
      </h5>
      <ul
        ref={listRef}
        className="flex justify-center gap-8 flex-nowrap overflow-x-auto no-scrollbar scroll-smooth"
        onMouseEnter={() => (scrolling.current = false)}
        onMouseLeave={() => (scrolling.current = true)}
        onTouchStart={() => (scrolling.current = false)}
        onTouchEnd={() => (scrolling.current = true)}
      >
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
