import { Routes, Route, Link } from "react-router-dom";
import Nav1 from "./components/Nav1";
import Hero1 from "./components/Hero1";
import Why from "./components/Why";
import Testi from "./components/Testi";
import Faq from "./components/Faq";
import Final from "./components/Final";
import Copy from "./components/Copy";
import Clb from "./components/collab";
import Auth from "./components/Auth";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Pricing from "./components/Pricing";
import ResetPassword from "./components/ResetPassword";
import Table from "./components/Table";
import ButtonTest from "./components/ButtonTest";
import Product from "./components/Product";
import Support from "./components/Support"; // ChatUser → renamed
import AdminSupport from "./components/AdminSupport"; // ChatAdmin → renamed
import DashboardLayout from "./components/DashboardLayout"; // layout sidebar

const Home = () => (
  <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
    <Nav1 />
    <Hero1 />
    <Why />
    <Testi />
    <Faq />
    <Final />
    <Copy />
    {/* <Table />
    <Clb /> */}
  </div>
);

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden pb-[10rem] pt-[6rem] bg-gradient-to-br from-[#FFECEC] via-[#F6C1C1] to-[#B08888]">
    <svg className="absolute top-0 left-0 w-full h-40 text-white/10" viewBox="0 0 1440 320" fill="currentColor">
      <path d="M0,96L40,117.3C80,139,160,181,240,176C320,171,400,117,480,101.3C560,85,640,107,720,122.7C800,139,880,149,960,154.7C1040,160,1120,160,1200,160C1280,160,1360,160,1400,160L1440,160L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z" />
    </svg>
    <svg className="absolute bottom-0 left-0 w-full h-40 text-white/10 rotate-180" viewBox="0 0 1440 320" fill="currentColor">
      <path d="M0,96L40,117.3C80,139,160,181,240,176C320,171,400,117,480,101.3C560,85,640,107,720,122.7C800,139,880,149,960,154.7C1040,160,1120,160,1200,160C1280,160,1360,160,1400,160L1440,160L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z" />
    </svg>
    <h1 className="text-[6rem] lg:text-[8rem] font-extrabold text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)] animate-pulse z-10">404</h1>
    <p className="text-2xl lg:text-3xl text-white font-semibold mt-12 mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)] z-10">Halaman Tidak Ditemukan</p>
    <p className="text-white/80 max-w-md mb-8 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] z-10">Maaf, halaman yang kamu cari tidak tersedia atau sudah dipindahkan.</p>
    <Link to="/" className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-white/50 rounded-full text-white font-medium transition duration-300 shadow z-10 backdrop-blur-sm">Kembali ke Beranda</Link>
  </div>
);

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Sign-Up" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/product" element={<Product />} />

        {/* ✅ Dashboard routes with sidebar layout */}
        <Route
          path="/dashboard/support"
          element={
            <DashboardLayout>
              <Support />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/admin-support"
          element={
            <DashboardLayout>
              <AdminSupport />
            </DashboardLayout>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
