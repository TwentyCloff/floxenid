import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";

// Lazy-loaded components
const Benefits = lazy(() => import("./components/Benefits"));
const Collaboration = lazy(() => import("./components/Collaboration"));
const Footer = lazy(() => import("./components/Footer"));
const Header = lazy(() => import("./components/Header"));
const Hero = lazy(() => import("./components/Hero"));
const Pricing = lazy(() => import("./components/Pricing"));
const Roadmap = lazy(() => import("./components/Roadmap"));
const Services = lazy(() => import("./components/Services"));
const PaymentPage = lazy(() => import("./components/PaymentPage")); // Tambahkan ini

const Home = () => (
  <>
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />
      <Hero />
      <Benefits />
      <Collaboration />
      <Services />
      <Pricing />
      <Roadmap />
      <Footer />
    </div>
    <ButtonGradient />
  </>
);

const Loading = () => <div className="flex justify-center items-center h-screen">Loading...</div>;

const App = () => (
  <Router>
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment" element={<PaymentPage />} /> {/* Tambahkan route ini */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Suspense>
  </Router>
);

export default App;
