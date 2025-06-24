import Section from "./Section";
import Lottie from "lottie-react";

const Hero = () => {
  return (
    <Section
      id="hero"
      customPaddings
      className="pt-[12rem] -mt-[5.25rem] relative overflow-hidden"
    >
      {/* Background gradient ivory mint */}
      <div
        className="absolute inset-0 z-[-20] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #D1F0E0 50%, #96C7B9 100%)",
        }}
      />

      {/* Konten utama dengan layout flex */}
      <div className="container relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-[80vh]">
        {/* Bagian kiri */}
        <div className="lg:w-1/2 mb-10 lg:mb-0 text-left">
          {/* Label Glassmorph */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className="font-medium text-white">Get Pro – Limited time offer</span>
          </div>

          {/* Judul utama */}
          <h1 className="h1 mb-6 text-n-8">
            Build smarter, faster than AI — powered by Floxen.
          </h1>

          {/* Subtext */}
          <p className="body-1 mb-8 text-n-6">
            The open-source stack for providing ready-to-use game scripts and premium tools with zero setup.
          </p>

          {/* Tombol Glassmorphism */}
          <a
            href="#pricing"
            className="inline-block px-7 py-3 rounded-full border border-n-8/30 text-n-8 font-semibold
                       bg-white/30 backdrop-blur-md hover:bg-white/40 transition-all duration-300 shadow-lg"
          >
            Get started
          </a>
        </div>

        {/* Bagian kanan dengan Lottie animation */}
        <div className="lg:w-1/2 flex justify-center">
          <Lottie 
            animationData="https://lottie.host/8a9643af-e270-40e2-b7ec-7301edfd8d35/fKhIPY68ZY.lottie" 
            className="w-full max-w-md"
            loop={true}
          />
        </div>
      </div>

      {/* Gradient transisi ke bawah */}
      <div
        className="absolute bottom-0 left-0 w-full h-[12rem] z-[-5]"
        style={{
          background: "linear-gradient(to bottom, transparent, #96C7B9)",
        }}
      />
    </Section>
  );
};

export default Hero;
