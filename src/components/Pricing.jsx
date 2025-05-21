import { smallSphere, stars } from "../assets";
import { LeftLine, RightLine } from "./design/Pricing";
import Heading from "./Heading";
import PricingList from "./PricingList";
import Section from "./Section";
import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

const Pricing = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const visibleProjectsCount = 3;

  // Fetch projects from Firebase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectCollection = collection(db, "projects");
        const projectSnapshot = await getDocs(projectCollection);
        const projectData = projectSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          category: doc.data().category || "Free" // Default category
        }));
        
        setProjects(projectData);
        setLoading(false);
        
        // Store in localStorage
        localStorage.setItem("projects", JSON.stringify(projectData));
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCategoryChange = (category) => {
    if (category !== selectedCategory) {
      setIsTransitioning(true);
      setShowAllProjects(false);
      setTimeout(() => {
        setSelectedCategory(category);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter((p) => p.category === selectedCategory);

  const displayedProjects = selectedCategory === "All" && !showAllProjects 
    ? filteredProjects.slice(0, visibleProjectsCount) 
    : filteredProjects;

  const toggleShowAll = () => {
    setShowAllProjects(!showAllProjects);
  };

  // Project Card Component
  const ProjectCard = ({ project }) => {
    const handleDetails = (e) => {
      if (!project.id) {
        console.log("ID kosong");
        e.preventDefault();
        alert("Project details are not available");
      }
    };

    return (
      <Link
        to={`/project/${project.id}`}
        onClick={handleDetails}
        className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur border border-white/10 hover:border-[#06B6D4]/30 transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#06B6D4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="relative overflow-hidden rounded-lg mb-3 h-40">
            <img
              src={project.Img}
              alt={project.Title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          </div>
          <div className="text-lg font-semibold text-white">{project.Title}</div>
          <div className="text-sm text-gray-400 mt-1">{project.category || "Project"}</div>
          <div className="mt-3 flex justify-end">
            <button className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 transition-all duration-200 hover:scale-105 active:scale-95 text-sm">
              <span>Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <Section className="overflow-hidden" id="pricing">
      <div className="container relative z-2">
        <div className="hidden relative justify-center mb-[6.5rem] lg:flex">
          <img
            src={smallSphere}
            className="relative z-1 pointer-events-none select-none"
            width={255}
            height={255}
            alt="Sphere"
          />

          <div className="absolute top-1/2 left-1/2 w-[60rem] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <img
              src={stars}
              className="w-full animate-pulse pointer-events-none select-none"
              width={950}
              height={400}
              alt="Stars"
            />
          </div>
        </div>

        <Heading
          tag="Get started with Brainwave"
          title="Pay once, use forever"
        />

        <div className="relative">
          <PricingList />
          <LeftLine />
          <RightLine />
        </div>

        <div className="flex justify-center mt-10">
          <a
            className="text-xs font-code font-bold tracking-wider uppercase border-b"
            href="#"
          >
            See the full details
          </a>
        </div>

        {/* Our Product Section */}
        <div className="mt-20 mb-20 pb-20">
          <div className="text-center mb-12">
            <div className="inline-block relative">
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#BAE6FD]">
                Our Product
              </h2>
            </div>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-[#06B6D4]" />
              Crafting digital experiences that inspire and perform
              <Sparkles className="w-5 h-5 text-[#BAE6FD]" />
            </p>
          </div>

          {/* Project Filter and Content */}
          <div className="mt-8 flex flex-col md:flex-row gap-6">
            {/* Left Side Filter */}
            <div className="md:w-48 flex-shrink-0">
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 w-full">
                {["All", "Free", "Premium", "Coming Soon"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/50"
                        : "text-gray-400 border border-transparent hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side Projects */}
            <div className="flex-1">
              {loading ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 backdrop-blur border border-white/10 animate-pulse h-48"></div>
                  ))}
                </div>
              ) : (
                <>
                  <div className={`grid sm:grid-cols-2 md:grid-cols-3 gap-6 transition-opacity duration-300 ${
                    isTransitioning ? "opacity-50" : "opacity-100"
                  }`}>
                    {displayedProjects.map((project, index) => (
                      <ProjectCard key={project.id || index} project={project} />
                    ))}
                  </div>
                  
                  {selectedCategory === "All" && filteredProjects.length > visibleProjectsCount && (
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={toggleShowAll}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 transition-all duration-200 flex items-center gap-2"
                      >
                        {showAllProjects ? (
                          <>
                            <span>Show Less</span>
                            <ArrowRight className="w-4 h-4 rotate-180" />
                          </>
                        ) : (
                          <>
                            <span>Show More</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Pricing;
