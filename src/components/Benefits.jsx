import { motion } from "framer-motion";
import { FiCheckCircle, FiShield, FiTrendingUp, FiZap } from "react-icons/fi";

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
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-white bg-blue-600 px-2 rounded-md">Qarvo</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We combine cutting-edge technology with exceptional service to deliver results that matter.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div>Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div>Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div>Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10x</div>
              <div>Performance</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
