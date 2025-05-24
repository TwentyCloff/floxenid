import { motion } from "framer-motion";
import { FiCheckCircle, FiShield, FiTrendingUp, FiZap } from "react-icons/fi";
import ClipPath from "../assets/svg/ClipPath"; // Make sure this path is correct

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Lightning Fast Performance",
      description: "Our solutions deliver unmatched speed and efficiency, ensuring your operations never slow down."
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Enterprise-Grade Security",
      description: "Military-grade encryption and robust protocols keep your data protected at all times."
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Proven Results",
      description: "We've helped hundreds of businesses achieve measurable growth and success."
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      title: "Reliable Support",
      description: "Our expert team is available 24/7 to ensure your systems run smoothly."
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Add the ClipPath SVG definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <ClipPath />
        </defs>
      </svg>

      {/* Background with the same clipPath */}
      <div className="absolute inset-0 -z-10" style={{ clipPath: "url(#benefits)" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-n-9 to-n-8 opacity-95" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full filter blur-[100px]" />
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]" />
      </div>

      {/* Rest of your original component remains exactly the same */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Why Choose <span className="relative inline-block">
              <span className="text-white relative z-10 px-2">Qarvo</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-md transform -skew-x-12 -z-0" />
            </span>?
          </h2>
          <p className="text-xl text-n-3/80 max-w-2xl mx-auto">
            We combine cutting-edge technology with exceptional service to deliver results that matter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-500/30 to-accent-500/30 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              
              <div className="h-full bg-n-7/50 backdrop-blur-sm border border-n-5/20 rounded-xl p-8 transition-all duration-300 group-hover:border-n-3/50">
                <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 text-primary-100">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-n-3/80">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 relative group"
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
                  <div className="text-4xl font-bold mb-2 text-white">
                    {stat.value}
                  </div>
                  <div className="text-n-3/80 uppercase text-sm tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
