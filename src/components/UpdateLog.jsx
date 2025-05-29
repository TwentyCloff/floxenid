import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { motion } from "framer-motion";
import { check2, grid, loading1 } from "../assets";
import Button from "./Button";
import Heading from "./Heading";
import Section from "./Section";
import Tagline from "./Tagline";

const UpdateLog = () => {
  const [updates, setUpdates] = useState([]);
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample engineering updates (will be combined with Firebase data)
  const engineeringUpdates = [
    {
      id: "eng-1",
      title: "Real-time Voting System",
      description: "Implemented Firebase real-time listeners for instant vote updates without page refresh. Optimized Firestore queries for minimal data transfer.",
      date: new Date("2023-10-15").toISOString(),
      status: "done",
      type: "engineering"
    },
    {
      id: "eng-2",
      title: "Automated Collection Creation",
      description: "Developed automatic Firestore collection initialization when users submit their first vote or feature request.",
      date: new Date("2023-10-18").toISOString(),
      status: "done",
      type: "engineering"
    },
    {
      id: "eng-3",
      title: "Motion Animations",
      description: "Added framer-motion animations for smoother UI transitions and better user experience.",
      date: new Date("2023-10-20").toISOString(),
      status: "done",
      type: "engineering"
    },
    {
      id: "eng-4",
      title: "Dark Theme Optimization",
      description: "Refactored all components to use a pure black theme with improved contrast ratios for better accessibility.",
      date: new Date("2023-10-22").toISOString(),
      status: "done",
      type: "engineering"
    }
  ];

  // Initialize Firestore collections if they don't exist
  const initializeCollections = async () => {
    const batch = writeBatch(db);
    
    // Create sample updates if collection is empty
    if (updates.length === 0) {
      const sampleUpdates = [
        {
          title: "Launch of Voting System",
          description: "We've launched our new feature voting system! Now you can suggest and vote on what we should build next.",
          date: new Date("2023-10-10").toISOString(),
          status: "done"
        },
        {
          title: "Mobile Optimization",
          description: "Improved mobile responsiveness across all pages for better experience on smartphones.",
          date: new Date("2023-10-12").toISOString(),
          status: "done"
        },
        {
          title: "User Profile System",
          description: "Working on new user profiles with voting history and achievements. Expected completion in 2 weeks.",
          date: new Date("2023-10-25").toISOString(),
          status: "in-progress"
        }
      ];
      
      sampleUpdates.forEach(update => {
        const docRef = doc(collection(db, "updates"));
        batch.set(docRef, update);
      });
    }

    // Create sample features if collection is empty
    if (features.length === 0) {
      const sampleFeatures = [
        {
          title: "Dark/Light Mode Toggle",
          description: "Add option to switch between dark and light themes",
          votes: 24,
          createdAt: new Date("2023-09-28").toISOString(),
          status: "planned"
        },
        {
          title: "Notification System",
          description: "Get notified when your suggested features get implemented",
          votes: 18,
          createdAt: new Date("2023-10-05").toISOString(),
          status: "planned"
        },
        {
          title: "User Badges",
          description: "Reward active voters with achievement badges",
          votes: 12,
          createdAt: new Date("2023-10-08").toISOString(),
          status: "in-progress"
        }
      ];
      
      sampleFeatures.forEach(feature => {
        const docRef = doc(collection(db, "features"));
        batch.set(docRef, feature);
      });
    }

    try {
      await batch.commit();
    } catch (error) {
      console.error("Error initializing collections:", error);
    }
  };

  // Fetch updates and features from Firebase
  useEffect(() => {
    const updatesQuery = query(collection(db, "updates"), orderBy("date", "desc"));
    const featuresQuery = query(collection(db, "features"), orderBy("votes", "desc"));

    const unsubscribeUpdates = onSnapshot(updatesQuery, (snapshot) => {
      const updatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Combine with engineering updates and sort by date
      const allUpdates = [...updatesData, ...engineeringUpdates].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      setUpdates(allUpdates);
    });

    const unsubscribeFeatures = onSnapshot(featuresQuery, (snapshot) => {
      const featuresData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeatures(featuresData);
      
      // Initialize collections if empty
      if (featuresData.length === 0) {
        initializeCollections();
      }
    });

    return () => {
      unsubscribeUpdates();
      unsubscribeFeatures();
    };
  }, []);

  const handleVote = async (featureId) => {
    const featureRef = doc(db, "features", featureId);
    const feature = features.find(f => f.id === featureId);
    
    try {
      await updateDoc(featureRef, {
        votes: (feature.votes || 0) + 1
      });
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleSubmitFeature = async (e) => {
    e.preventDefault();
    if (!newFeature.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "features"), {
        title: newFeature,
        votes: 1,
        createdAt: new Date().toISOString(),
        status: "pending",
        description: ""
      });
      setNewFeature("");
    } catch (error) {
      console.error("Error submitting feature:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section className="overflow-hidden bg-n-9" id="updatelog">
      <div className="container md:pb-10">
        <Heading tag="Stay Updated" title="Development Progress & Feature Voting" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Updates Section */}
          <div className="bg-n-8 rounded-3xl p-8 shadow-xl border border-n-7">
            <h3 className="h3 mb-6 text-center text-n-1">Development Updates</h3>
            <div className="space-y-6">
              {updates.map((update) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-n-7 rounded-2xl p-6 border-l-4 ${
                    update.status === "done" ? "border-green-500" : "border-amber-500"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <Tagline>
                      {new Date(update.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      {update.type === "engineering" && (
                        <span className="ml-2 px-2 py-0.5 bg-n-6 rounded-full text-xs">
                          Dev Note
                        </span>
                      )}
                    </Tagline>

                    <div className="flex items-center px-3 py-1 bg-n-6 rounded-full">
                      <img
                        className={`mr-2 ${update.status !== "done" && "animate-spin"}`}
                        src={update.status === "done" ? check2 : loading1}
                        width={14}
                        height={14}
                        alt={update.status}
                      />
                      <span className="text-xs font-medium text-n-1">
                        {update.status === "done" ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  </div>
                  <h4 className="h4 mb-2 text-n-1">{update.title}</h4>
                  <p className="body-2 text-n-3">{update.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Feature Voting Section */}
          <div className="bg-n-8 rounded-3xl p-8 shadow-xl border border-n-7">
            <h3 className="h3 mb-6 text-center text-n-1">Feature Voting</h3>
            
            <form onSubmit={handleSubmitFeature} className="mb-8">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Suggest a new feature..."
                  className="flex-1 bg-n-7 border border-n-6 rounded-xl px-4 py-3 text-n-1 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-n-4"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="whitespace-nowrap bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>

            <div className="space-y-4">
              {features.length > 0 ? (
                features.map((feature) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-n-7 rounded-xl p-4 flex justify-between items-center border border-n-6"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="h5 mb-1 text-n-1 truncate">{feature.title}</h4>
                      {feature.description && (
                        <p className="text-sm text-n-3 mb-2 truncate">{feature.description}</p>
                      )}
                      <div className="flex items-center text-xs">
                        <span className="text-n-3">
                          {new Date(feature.createdAt).toLocaleDateString()}
                        </span>
                        <span className="mx-2 text-n-5">•</span>
                        <span className={`capitalize ${
                          feature.status === "planned" ? "text-amber-400" :
                          feature.status === "in-progress" ? "text-blue-400" :
                          feature.status === "completed" ? "text-green-400" : "text-n-4"
                        }`}>
                          {feature.status}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleVote(feature.id)}
                      className="flex items-center gap-2 bg-n-6 hover:bg-n-5 min-w-[80px] justify-center"
                    >
                      <span>👍</span>
                      <span className="font-medium">{feature.votes || 0}</span>
                    </Button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 bg-n-7 rounded-xl">
                  <p className="body-2 text-n-4">Loading features...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Black theme divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-n-6 to-transparent my-12" />
        
        <div className="flex justify-center">
          <Button href="#" className="bg-n-7 hover:bg-n-6">
            View Full Changelog
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default UpdateLog;
