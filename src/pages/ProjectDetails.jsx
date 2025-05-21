import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // pastikan ini sesuai dengan file konfigurasi firebase-mu

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const ref = doc(db, 'projects', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProject(snap.data());
      } else {
        console.error('Project not found');
      }
    };

    fetchData();
  }, [id]);

  if (!project) return <p className="text-center py-20 text-lg">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <img src={project.image} alt={project.name} className="w-full rounded-lg mb-6" />
      <p className="text-gray-700 mb-4">{project.description}</p>
      <p className="text-xl font-semibold">Price: {project.price}</p>
    </div>
  );
};

export default ProjectDetails;
