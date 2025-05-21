// src/pages/ProjectDetails.jsx
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
          // Jika project tidak ditemukan, kembali ke halaman utama
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

  if (loading) return <div>Loading project details...</div>;

  if (!project) return <div>Project not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 underline"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
      <p className="mb-6">{project.description}</p>
      <p className="text-xl font-semibold mb-6">Price: ${project.price}</p>

      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={project.title}
          className="rounded-lg w-full object-cover"
        />
      )}

      {/* Tambahkan konten lain sesuai data project */}
    </div>
  );
};

export default ProjectDetails;
