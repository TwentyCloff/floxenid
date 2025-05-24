import { motion } from "framer-motion";
import { FiCheckCircle, FiShield, FiTrendingUp, FiZap } from "react-icons/fi";
import ClipPath from "../assets/svg/ClipPath";
import Heading from "./Heading";
import Section from "./Section";
import { curve } from "../assets";

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: <FiZap className="w-12 h-12" />,
      title: "Lightning Fast Performance",
      description: "Our solutions deliver unmatched speed and efficiency, ensuring your operations never slow down."
    },
    {
      id: 2,
      icon: <FiShield className="w-12 h-12" />,
      title: "Enterprise-Grade Security",
      description: "Military-grade encryption and robust protocols keep your data protected at all times."
    },
    {
      id: 3,
      icon: <FiTrendingUp className="w-12 h-12" />,
      title: "Proven Results",
      description: "We've helped hundreds of businesses achieve measurable growth and success."
    },
    {
      id: 4,
      icon: <FiCheckCircle className="w-12 h-12" />,
      title: "Reliable Support",
      description: "Our expert team is available 24/7 to ensure your systems run smoothly."
    }
  ];

  return (
    <Section id="why-choose-us">
      <div className="container relative z-2">
        <Heading
          className="md:max-w-md lg:max-w-2xl"
          title={
            <>
              Why Choose{" "}
              <span className="inline-block relative font-semibold">
                Qarvo?
                <img
                  src={curve}
                  className="absolute top-full left-0 w-full xl:-mt-2 pointer-events-none select-none"
                  width={624}
                  height={28}
                  alt="Curve"
                />
              </span>
            </>
          }
        />

        <div className="flex flex-wrap gap-10 mb-10">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: feature.id * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
            >
              <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem]">
                <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 text-primary-100">
                  {feature.icon}
                </div>
                <h5 className="h5 mb-5 text-white">{feature.title}</h5>
                <p className="body-2 mb-6 text-n-3">{feature.description}</p>
              </div>

              <div
                className="absolute inset-0.5 bg-n-7/50 backdrop-blur-sm border border-n-5/20"
                style={{ clipPath: "url(#benefits)" }}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-accent-500/30" />
                </div>
              </div>

              <ClipPath />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute inset-0 rounded-xl p-px bg-gradient-to-r from-primary-500/30 via-accent-500/30 to-primary-500/30 -z-10">
            <div className="absolute inset-0 bg-n-8/80 rounded-xl" />
          </div>
          
          <div className="bg-n-7/50 backdrop-blur-sm border border-n-5/20 rounded-xl p-8 transition-all duration-300 group-hover:border-n-3/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "99.9%", label: "Uptime" },
                { value: "500+", label: "Happy Clients" },
                { value: "24/7", label: "Support" },
                { value: "10x", label: "Performance" }
              ].map((stat, i) => (
                <div key={i} className="relative">
                  <div className="h5 mb-2 text-white">
                    {stat.value}
                  </div>
                  <div className="body-2 text-n-3/80 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default WhyChooseUs;
