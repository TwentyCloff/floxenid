import { useState, useEffect } from "react";
import { check2, grid, loading1 } from "../assets";
import { roadmap } from "../constants";
import Button from "./Button";
import Heading from "./Heading";
import Section from "./Section";
import Tagline from "./Tagline";
import { Gradient } from "./design/Roadmap";
import { db, auth } from "../config/firebaseConfig";
import { collection, doc, getDocs, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";

const Roadmap = () => {
  const [updates, setUpdates] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        // Set up realtime listener for updates
        const updatesCollection = collection(db, "updates");
        const unsubscribe = onSnapshot(updatesCollection, (snapshot) => {
          const updatesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setUpdates(updatesData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching updates:", error);
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  useEffect(() => {
    // Check if user is logged in and get their votes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userVotesRef = doc(db, "userVotes", user.uid);
        getDoc(userVotesRef).then((docSnap) => {
          if (docSnap.exists()) {
            setUserVotes(docSnap.data().votes || {});
          }
        });
      } else {
        setUserVotes({});
      }
    });

    return () => unsubscribe();
  }, []);

  const handleVote = async (updateId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please login to vote");
        return;
      }

      const updateRef = doc(db, "updates", updateId);
      const userVotesRef = doc(db, "userVotes", user.uid);

      // Check if user already voted for this update
      const hasVoted = userVotes[updateId];

      if (hasVoted) {
        // Remove vote
        await updateDoc(updateRef, {
          votes: arrayRemove(user.uid)
        });
        await updateDoc(userVotesRef, {
          [`votes.${updateId}`]: false
        }, { merge: true });
      } else {
        // Add vote
        await updateDoc(updateRef, {
          votes: arrayUnion(user.uid)
        });
        await updateDoc(userVotesRef, {
          [`votes.${updateId}`]: true
        }, { merge: true });
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <Section className="overflow-hidden" id="updatelog">
      <div className="container md:pb-10">
        <Heading tag="Latest Updates" title="What we're working on" />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <img className="animate-spin" src={loading1} width={40} height={40} alt="Loading" />
          </div>
        ) : (
          <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]">
            {updates.map((item) => {
              const status = item.status === "done" ? "Done" : "In progress";
              const voteCount = item.votes ? item.votes.length : 0;
              const hasVoted = userVotes[item.id] || false;

              return (
                <div
                  className={`md:flex even:md:translate-y-[7rem] p-0.25 rounded-[2.5rem] ${
                    item.colorful ? "bg-conic-gradient" : "bg-n-6"
                  }`}
                  key={item.id}
                >
                  <div className="relative p-8 bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-15">
                    <div className="absolute top-0 left-0 max-w-full">
                      <img
                        className="w-full pointer-events-none select-none"
                        src={grid}
                        width={550}
                        height={550}
                        alt="Grid"
                      />
                    </div>
                    <div className="relative z-1">
                      <div className="flex items-center justify-between max-w-[27rem] mb-8 md:mb-20">
                        <Tagline>{item.date}</Tagline>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center px-4 py-1 bg-n-1 rounded text-n-8">
                            <img
                              className={`mr-2.5 ${
                                item.status !== "done" && "animate-spin"
                              } pointer-events-none select-none`}
                              src={item.status === "done" ? check2 : loading1}
                              width={16}
                              height={16}
                              alt={status}
                            />
                            <div className="tagline">{status}</div>
                          </div>
                          
                          <button 
                            onClick={() => handleVote(item.id)}
                            className={`flex items-center px-3 py-1 rounded-full ${hasVoted ? 'bg-green-500' : 'bg-n-6'} text-white`}
                          >
                            <span className="mr-2">👍</span>
                            <span>{voteCount}</span>
                          </button>
                        </div>
                      </div>

                      {item.imageUrl && (
                        <div className="mb-10 -my-10 -mx-15">
                          <img
                            className={`w-full ${
                              item.status !== "done" && "animate-pulse"
                            } pointer-events-none select-none`}
                            src={item.imageUrl}
                            width={628}
                            height={426}
                            alt={item.title}
                          />
                        </div>
                      )}
                      <h4 className="h4 mb-4">{item.title}</h4>
                      <p className="body-2 text-n-4">{item.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            <Gradient />
          </div>
        )}

        <div className="flex justify-center mt-12 md:mt-15 xl:mt-20">
          <Button href="#">View all updates</Button>
        </div>
      </div>
    </Section>
  );
};

export default Roadmap;
