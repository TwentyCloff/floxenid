import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProject(docSnap.data());
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  if (loading) return <div className="text-center py-20 text-white">Loading project details...</div>;
  if (!project) return <div className="text-center py-20 text-white">Project not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-400 hover:underline text-sm transition-all"
      >
        ← Back to Pricing
      </button>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
        <h1 className="text-4xl font-extrabold mb-4 text-gradient bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {project.title}
        </h1>
        <p className="mb-6 text-white/80">{project.description}</p>
        <p className="text-xl font-bold mb-6 text-blue-400">Price: ${project.price}</p>

        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="rounded-lg w-full object-cover shadow-lg"
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
