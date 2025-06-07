import { FaFutbol, FaVolleyballBall, FaBasketballBall, FaCampground, FaMusic, FaFlag, FaBook, FaFistRaised, FaUserShield, FaGraduationCap, FaNewspaper, FaFlask, FaFirstAid, FaBoxingGloves, FaSwimmingPool } from 'react-icons/fa';
import Section from "./Section";
import Button from "./Button";
import { LeftCurve, RightCurve } from "./design/Collaboration";

// Define your clubs list
const clubsList = [
  {
    id: '1',
    icon: 'futsal',
    title: 'Futsal Club',
    description: 'Master your footwork and teamwork on the field'
  },
  {
    id: '2',
    icon: 'voli',
    title: 'Volleyball Club',
    description: 'Spike your way to victory with our team'
  },
  {
    id: '3',
    icon: 'basket',
    title: 'Basketball Club',
    description: 'Dribble, shoot, and score like a pro'
  },
  {
    id: '4',
    icon: 'pramuka',
    title: 'Scout Club',
    description: 'Learn survival skills and outdoor adventures'
  },
  {
    id: '5',
    icon: 'tari',
    title: 'Dance Art',
    description: 'Express yourself through graceful movements'
  },
  {
    id: '6',
    icon: 'paskibra',
    title: 'Flag Corps',
    description: 'Discipline and patriotism in every march'
  },
  {
    id: '7',
    icon: 'rohis',
    title: 'Religious Study',
    description: 'Deepen your spiritual knowledge'
  },
  {
    id: '8',
    icon: 'silat',
    title: 'Pencak Silat',
    description: 'Traditional martial arts mastery'
  },
  {
    id: '9',
    icon: 'kempo',
    title: 'Kempo Club',
    description: 'Japanese martial arts training'
  },
  {
    id: '10',
    icon: 'karate',
    title: 'Karate Club',
    description: 'Discipline through martial arts'
  },
  {
    id: '11',
    icon: 'kir',
    title: 'Science Club',
    description: 'Explore the wonders of science'
  },
  {
    id: '12',
    icon: 'jurnalistik',
    title: 'Journalism Club',
    description: 'Uncover and report school news'
  },
  {
    id: '13',
    icon: 'music',
    title: 'Music Club',
    description: 'Create harmony with fellow musicians'
  },
  {
    id: '14',
    icon: 'pmr',
    title: 'First Aid Club',
    description: 'Learn life-saving medical skills'
  },
  {
    id: '15',
    icon: 'tinju',
    title: 'Boxing Club',
    description: 'Train your strength and reflexes'
  },
  {
    id: '16',
    icon: 'aflateen',
    title: 'English Club',
    description: 'Improve your language skills'
  }
];

// Map icons to React Icons components
const clubIcons = {
  futsal: FaFutbol,
  voli: FaVolleyballBall,
  basket: FaBasketballBall,
  pramuka: FaCampground,
  tari: FaMusic,
  paskibra: FaFlag,
  rohis: FaBook,
  silat: FaFistRaised,
  kempo: FaUserShield,
  karate: FaGraduationCap,
  kir: FaFlask,
  jurnalistik: FaNewspaper,
  music: FaMusic,
  pmr: FaFirstAid,
  tinju: FaBoxingGloves,
  anggar: FaSwimmingPool,
  aflareen: FaGraduationCap
};

const Clubs = () => {
  return (
    <Section 
      id="clubs"
      crosses
      className="pt-[4rem] -mt-[2rem]"
    >
      <div className="container lg:flex flex-col lg:flex-row gap-12 items-center">
        {/* Left Content - Text and Clubs */}
        <div className="lg:max-w-[30rem] text-center lg:text-left">
          <h2 className="h2 mb-6 md:mb-8 relative inline-block">
            <span className="relative z-10 text-white">
              Diverse Clubs for{' '}
              <span className="text-gradient font-bold">Your Passion</span>
            </span>
            <svg 
              className="absolute -bottom-2 left-0 w-full xl:-mt-2 pointer-events-none select-none"
              width="624" 
              height="28" 
              viewBox="0 0 624 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M0 14C0 14 72.5 0 312 14C551.5 28 624 14 624 14" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </h2>

          <p className="body-2 mb-8 text-n-2 lg:pr-8 text-gray-300">
            Discover your passion and develop new skills through our wide range of extracurricular activities. 
            Whether you're into sports, arts, or academics, there's a place for everyone!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {clubsList.map((club) => {
              const IconComponent = clubIcons[club.icon];
              return (
                <div 
                  className="bg-n-7/80 p-4 rounded-xl border border-n-6 hover:bg-n-7 transition-colors backdrop-blur-sm"
                  key={club.id}
                >
                  <div className="flex items-start">
                    <IconComponent className="mt-1 flex-shrink-0 pointer-events-none select-none text-lg text-primary" />
                    <div className="ml-3">
                      <h6 className="body-2 font-medium text-white">{club.title}</h6>
                      {club.description && (
                        <p className="body-2 mt-1 text-n-2">{club.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Button className="mx-auto lg:mx-0" white>Join Now</Button>
        </div>

        {/* Right Content - Club Visualization */}
        <div className="relative w-full max-w-[32rem] lg:w-[40rem] aspect-square mt-10 lg:mt-0">
          {/* Central Club Icon with Animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-40 h-40 rounded-xl bg-n-8 border-2 border-primary/30 flex items-center justify-center p-6 backdrop-blur-sm">
              <FaFutbol className="z-10 text-6xl text-primary" />
              <div className="absolute inset-0 rounded-xl bg-primary/10 blur-xl animate-pulse"></div>
            </div>
          </div>

          {/* Rotating Orbit with Club Highlights */}
          <div className="absolute inset-0 animate-spin-slow">
            {clubsList.slice(0, 6).map((club, i) => {
              const angle = (i * 360) / 6;
              const radius = 10; // rem units
              const x = Math.sin((angle * Math.PI) / 180) * radius;
              const y = Math.cos((angle * Math.PI) / 180) * radius;
              const IconComponent = clubIcons[club.icon];
              
              return (
                <div
                  key={club.id}
                  className="absolute w-16 h-16 -mt-8 -ml-8"
                  style={{
                    left: `calc(50% + ${x}rem)`,
                    top: `calc(50% - ${y}rem)`,
                  }}
                >
                  <div className="relative w-full h-full bg-n-7/80 border-2 border-n-6 rounded-xl flex items-center justify-center p-2 hover:scale-110 transition-transform duration-300 hover:shadow-lg hover:shadow-primary/20 backdrop-blur-sm">
                    <IconComponent className="text-3xl text-primary" />
                    <div className="absolute -z-10 inset-0 rounded-xl bg-primary/10 blur-md"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 rounded-full border-2 border-n-6/50 opacity-30"></div>
          <div className="absolute inset-4 rounded-full border-2 border-n-6/30 opacity-20"></div>
          <div className="absolute inset-8 rounded-full border-2 border-n-6/10 opacity-10"></div>
        </div>
      </div>
    </Section>
  );
};

export default Clubs;
