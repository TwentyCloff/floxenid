import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDP6XNlI1jUgHN3pVWIXNZjGT3YWXKSdes",
  authDomain: "gweenlearn.firebaseapp.com",
  projectId: "gweenlearn",
  storageBucket: "gweenlearn.firebasestorage.app",
  messagingSenderId: "915816429541",
  appId: "1:915816429541:web:65c885efda4472930c210c",
  measurementId: "G-RSGBWRE6BD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
          // Jika tidak ada data, redirect ke home
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
