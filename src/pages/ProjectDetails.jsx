import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Project tidak ditemukan!");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project tidak ditemukan</div>;

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold">{project.Title}</h1>
      <img src={project.Img} alt={project.Title} className="my-6 rounded-lg" />
      <p className="text-lg">{project.Description}</p>
    </div>
  );
};

export default ProjectDetail;
