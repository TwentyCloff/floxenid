import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { motion } from "framer-motion";
import { check2, grid, loading1 } from "../assets";
import Button from "./Button";
import Heading from "./Heading";
import Section from "./Section";
import Tagline from "./Tagline";
import { Gradient } from "./design/Roadmap";

const UpdateLog = () => {
  const [updates, setUpdates] = useState([]);
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch updates and features from Firebase
  useEffect(() => {
    const updatesQuery = query(collection(db, "updates"), orderBy("date", "desc"));
    const featuresQuery = query(collection(db, "features"), orderBy("votes", "desc"));

    const unsubscribeUpdates = onSnapshot(updatesQuery, (snapshot) => {
      const updatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUpdates(updatesData);
    });

    const unsubscribeFeatures = onSnapshot(featuresQuery, (snapshot) => {
      const featuresData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeatures(featuresData);
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
        votes: feature.votes + 1
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
        status: "pending"
      });
      setNewFeature("");
    } catch (error) {
      console.error("Error submitting feature:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section className="overflow-hidden" id="updatelog">
      <div className="container md:pb-10">
        <Heading tag="Stay Updated" title="What's New & Coming Next" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Updates Section */}
          <div className="bg-n-8 rounded-3xl p-8 shadow-lg">
            <h3 className="h3 mb-6 text-center">Latest Updates</h3>
            <div className="space-y-6">
              {updates.length > 0 ? (
                updates.map((update) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-n-7 rounded-2xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <Tagline>{new Date(update.date).toLocaleDateString()}</Tagline>
                      <div className="flex items-center px-3 py-1 bg-n-6 rounded-full">
                        <img
                          className={`mr-2 ${update.status !== "done" && "animate-spin"}`}
                          src={update.status === "done" ? check2 : loading1}
                          width={14}
                          height={14}
                          alt={update.status}
                        />
                        <span className="text-xs font-medium">
                          {update.status === "done" ? "Completed" : "In Progress"}
                        </span>
                      </div>
                    </div>
                    <h4 className="h4 mb-2">{update.title}</h4>
                    <p className="body-2 text-n-3">{update.description}</p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="body-2 text-n-4">No updates yet. Check back soon!</p>
                </div>
              )}
            </div>
          </div>

          {/* Feature Voting Section */}
          <div className="bg-n-8 rounded-3xl p-8 shadow-lg">
            <h3 className="h3 mb-6 text-center">Vote for Next Feature</h3>
            
            <form onSubmit={handleSubmitFeature} className="mb-8">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Suggest a new feature..."
                  className="flex-1 bg-n-7 border border-n-6 rounded-xl px-4 py-3 text-n-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="whitespace-nowrap"
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
                    className="bg-n-7 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="h5 mb-1">{feature.title}</h4>
                      <div className="flex items-center">
                        <span className="text-xs text-n-3">
                          {new Date(feature.createdAt).toLocaleDateString()}
                        </span>
                        <span className="mx-2 text-n-4">•</span>
                        <span className="text-xs capitalize text-n-3">
                          {feature.status}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleVote(feature.id)}
                      className="flex items-center gap-2 bg-n-6 hover:bg-n-5"
                    >
                      <span>👍</span>
                      <span>{feature.votes || 0}</span>
                    </Button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="body-2 text-n-4">No features to vote on yet. Be the first to suggest one!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Gradient />
      </div>
    </Section>
  );
};

export default UpdateLog;
