// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import DOMPurify from "dompurify";
// import { MathJax, MathJaxContext } from "better-react-mathjax";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FaSearch,
//   FaChevronLeft,
//   FaChevronRight,
//   FaBars,
//   FaTimes,
//   FaCheckCircle,
//   FaTimesCircle,
// } from "react-icons/fa";
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import "tailwindcss/tailwind.css";
// import { TailSpin } from "react-loader-spinner";
// import confetti from "canvas-confetti";

// function CategoryPage() {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const [category, setCategory] = useState(null);
//   const [content, setContent] = useState([]);
//   const [selectedContent, setSelectedContent] = useState(null);
//   const [error, setError] = useState(null);
//   const [contentSearchTerm, setContentSearchTerm] = useState("");
//   const [quizSearchTerm, setQuizSearchTerm] = useState("");
//   const [placements, setPlacements] = useState([]);
//   const [hackathons, setHackathons] = useState([]);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [userAnswers, setUserAnswers] = useState({});
//   const [quizSubmitted, setQuizSubmitted] = useState(false);
//   const [score, setScore] = useState(0);

//   const quizContainerRef = useRef(null);
//   const [showExplanation, setShowExplanation] = useState({});
//   const [alertMessage, setAlertMessage] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [categoryRes, placementsRes, hackathonsRes] = await Promise.all([
//           axios.get(`http://localhost:5000/api/categories/slug/${slug}`),
//           axios.get("http://localhost:5000/api/placements"),
//           axios.get("http://localhost:5000/api/hackathons"),
//         ]);

//         setCategory(categoryRes.data);
//         const contentRes = await axios.get(
//           `http://localhost:5000/api/content/category/${categoryRes.data._id}`
//         );
//         setContent(contentRes.data);
//         setPlacements(placementsRes.data);
//         setHackathons(hackathonsRes.data);

//         document.title = categoryRes.data.title;
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError(
//           error.response?.status === 404
//             ? "Category not found"
//             : "An error occurred while fetching data"
//         );
//       }
//     };
//     fetchData();
//   }, [slug]);

//   const showAlert = useCallback((text, type) => {
//     setAlertMessage({ text, type });
//     setTimeout(() => {
//       setAlertMessage(null);
//     }, 3000);
//   }, []);
//   const sanitizeAndRenderContent = (htmlContent) => ({
//     __html: DOMPurify.sanitize(htmlContent, {
//       ADD_TAGS: [
//         "math",
//         "mrow",
//         "mi",
//         "mo",
//         "mn",
//         "msup",
//         "mfrac",
//         "img",
//         "pre",
//         "code",
//       ],
//       ADD_ATTR: ["display", "xmlns", "src", "alt", "class", "style"],
//     }),
//   });

//   const renderContent = (text) => {
//     const parts = text.split(
//       /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$|<pre[\s\S]*?<\/pre>)/
//     );
//     return parts.map((part, index) => {
//       if (part.startsWith("$$") && part.endsWith("$$")) {
//         return <MathJax key={index}>{`\\[${part.slice(2, -2)}\\]`}</MathJax>;
//       } else if (part.startsWith("$") && part.endsWith("$")) {
//         return <MathJax key={index}>{`\\(${part.slice(1, -1)}\\)`}</MathJax>;
//       } else if (part.startsWith("<pre") && part.endsWith("</pre>")) {
//         return (
//           <div
//             key={index}
//             dangerouslySetInnerHTML={sanitizeAndRenderContent(part)}
//           />
//         );
//       } else {
//         return (
//           <span key={index}>
//             {part.split("\n").map((line, i) => (
//               <React.Fragment key={i}>
//                 {i > 0 && <br />}
//                 <span
//                   dangerouslySetInnerHTML={sanitizeAndRenderContent(line)}
//                 />
//               </React.Fragment>
//             ))}
//           </span>
//         );
//       }
//     });
//   };

//   const handleContentClick = (content) => {
//     setSelectedContent(content);
//     setUserAnswers({});
//     setQuizSubmitted(false);
//     setScore(0);
//     setCurrentQuestionIndex(0);
//     setShowExplanation(false);
//     setSidebarOpen(false);
//   };

//   const handleOptionSelect = (questionIndex, option) => {
//     if (!quizSubmitted) {
//       setUserAnswers((prev) => ({ ...prev, [questionIndex]: option }));
//       const isCorrect = option === selectedContent.questions[questionIndex].correctAnswer;
//       showAlert(
//         isCorrect ? "Correct answer!" : "Wrong answer. Try again!",
//         isCorrect ? "success" : "error"
//       );
//     }
//   };

//   const handleQuizSubmit = () => {
//     let newScore = 0;
//     selectedContent.questions.forEach((question, index) => {
//       if (userAnswers[index] === question.correctAnswer) {
//         newScore++;
//       }
//     });
//     setScore(newScore);
//     setQuizSubmitted(true);

//     if (newScore === selectedContent.questions.length) {
//       confetti({
//         particleCount: 100,
//         spread: 70,
//         origin: { y: 0.6 },
//       });
//     }
//   };

//   const renderQuizContent = () => {
//     if (!selectedContent || selectedContent.type !== "quiz") return null;

//     const filteredQuestions = selectedContent.questions.filter((question) =>
//       question.question.toLowerCase().includes(quizSearchTerm.toLowerCase())
//     );

//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -20 }}
//         className="bg-white p-6 rounded-lg shadow-lg"
//         ref={quizContainerRef}
//       >
//         <h2 className="text-3xl font-bold mb-6 text-teal-700">
//           {selectedContent.title}
//         </h2>
//         <div className="mb-6">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search questions..."
//               value={quizSearchTerm}
//               onChange={(e) => setQuizSearchTerm(e.target.value)}
//               className="w-full px-4 py-3 pr-10 border-2 border-teal-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
//             />
//             <FaSearch className="absolute right-3 top-3 text-teal-400" />
//           </div>
//         </div>
//         {filteredQuestions.length > 0 ? (
//           <div>
//             {filteredQuestions.map((question, questionIndex) => (
//               <div
//                 key={questionIndex}
//                 className="mb-8 p-4 bg-teal-50 rounded-lg"
//               >
//                 <p className="text-xl font-semibold text-teal-800 mb-4">
//                   <span className="font-bold">
//                     Question {questionIndex + 1}:
//                   </span>{" "}
//                   <MathJaxContext>
//                     {renderContent(question.question)}
//                   </MathJaxContext>
//                 </p>
//                 {question.image && (
//                   <img
//                     src={question.image}
//                     alt={`Question ${questionIndex + 1}`}
//                     className="mb-4 max-w-full h-auto rounded-lg shadow-md"
//                   />
//                 )}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   {["a", "b", "c", "d"].map((option, optionIndex) => (
//                     <motion.button
//                       key={option}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => {
//                         handleOptionSelect(questionIndex, option);
//                         const isCorrect = option === question.correctAnswer;
//                         setAlertMessage({
//                           text: isCorrect
//                             ? "Correct answer!"
//                             : "Wrong answer. Try again!",
//                           type: isCorrect ? "success" : "error",
//                         });
//                       }}
//                       className={`p-4 rounded-lg text-left transition-colors relative ${
//                         userAnswers[questionIndex] === option
//                           ? "bg-teal-600 text-white"
//                           : "bg-teal-100 text-teal-700 hover:bg-teal-200"
//                       }`}
//                     >
//                       <span className="font-semibold mr-2">
//                         {option.toUpperCase()}.
//                       </span>
//                       <MathJaxContext>
//                         {renderContent(question.options[optionIndex])}
//                       </MathJaxContext>
//                     </motion.button>
//                   ))}
//                 </div>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() =>
//                     setShowExplanation((prevState) => ({
//                       ...prevState,
//                       [questionIndex]: !prevState[questionIndex],
//                     }))
//                   }
//                   className="mt-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
//                 >
//                   {showExplanation[questionIndex] ? "Hide" : "Show"} Answer
//                 </motion.button>
//                 <AnimatePresence>
//                   {showExplanation[questionIndex] && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: "auto" }}
//                       exit={{ opacity: 0, height: 0 }}
//                       className="mt-4 p-4 bg-emerald-100 rounded-lg"
//                     >
//                       <h3 className="text-lg font-semibold text-emerald-800 mb-2">
//                         Correct Answer: {question.correctAnswer.toUpperCase()}
//                       </h3>
//                       <h3 className="text-lg font-semibold text-emerald-800 mb-2">
//                         Explanation:
//                       </h3>
//                       <MathJaxContext>
//                         {renderContent(question.explanation)}
//                       </MathJaxContext>
//                     </motion.div>
//                   )}3
//                 </AnimatePresence>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-teal-600 text-lg">
//             No matching questions found.
//           </p>
//         )}
//       </motion.div>
//     );
//   };

//   const renderNotesContent = () => {
//     if (!selectedContent || selectedContent.type !== "notes") return null;

//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -20 }}
//         className="bg-white p-8 rounded-lg shadow-lg"
//       >
//         <h2 className="text-3xl font-bold mb-6 text-teal-700">
//           {selectedContent.title}
//         </h2>
//         <div className="prose prose-lg max-w-none">
//           <MathJaxContext>
//             {renderContent(selectedContent.description)}
//           </MathJaxContext>
//         </div>
//         <p className="mt-8 text-sm text-teal-500">
//           Last updated:{" "}
//           {new Date(selectedContent.lastUpdated).toLocaleDateString()}
//         </p>
//       </motion.div>
//     );
//   };

//   const renderCarousel = (items, type) => (
//     <Carousel
//       showArrows={true}
//       showStatus={false}
//       showThumbs={false}
//       infiniteLoop={true}
//       autoPlay={true}
//       interval={3000}
//       className="mb-8"
//     >
//       {items.map((item) => (
//         <motion.div
//           key={item._id}
//           whileHover={{ scale: 1.05 }}
//           className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
//           onClick={() => navigate("/events", { state: { type, item } })}
//         >
//           <img
//             src={type === "placement" ? item.logo : item.bannerLogoLink}
//             alt={
//               type === "placement"
//                 ? `${item.companyName} Logo`
//                 : `${item.instituteOrCompany} Banner`
//             }
//             className="w-full h-48 object-contain mb-4"
//           />
          
//           <p className="text-teal-600">
//             {type === "placement" ? item.jobTitle : `${item.eventType} Event`}
//           </p>
//         </motion.div>
//       ))}
//     </Carousel>
//   );

//   if (error) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="text-red-500 text-center mt-8 text-xl"
//       >
//         {error}
//       </motion.div>
//     );
//   }

//   if (!category) {
//     return (
//       <div className="flex justify-center items-center mt-16">
//         <TailSpin height="80" width="80" color="#14B8A6" ariaLabel="loading" />
//       </div>
//     );
//   }

//   const filteredContent = content.filter((item) =>
//     item.title.toLowerCase().includes(contentSearchTerm.toLowerCase())
//   );

//   return (
//     <div className="bg-gradient-to-br from-teal-100 to-emerald-100 min-h-screen">
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Left Sidebar */}
//           <AnimatePresence>
//             {(sidebarOpen || window.innerWidth >= 768) && (
//               <motion.div
//                 initial={{ x: -300, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 exit={{ x: -300, opacity: 0 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                 className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg sticky top-20"
//               >
//                 <h2 className="text-2xl font-semibold mb-4 text-teal-700">
//                 Content
//                 </h2>
//                 <div className="mb-4">
//                   <div className="relative">
//                     <input
//                       type="text"
//                       placeholder="Search content..."
//                       value={contentSearchTerm}
//                       onChange={(e) => setContentSearchTerm(e.target.value)}
//                       className="w-full px-4 py-2 pr-10 border-2 border-teal-300 rounded-md focus:outline-none focus:border-teal-500 transition-colors"
//                     />
//                     <FaSearch className="absolute right-3 top-3 text-teal-400" />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   {filteredContent.map((item, index) => (
//                     <motion.button
//                       key={index}
//                       onClick={() => handleContentClick(item)}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
//                         selectedContent && selectedContent._id === item._id
//                           ? "bg-teal-600 text-white"
//                           : "bg-teal-100 text-teal-700 hover:bg-teal-200"
//                       }`}
//                     >
//                       {item.title}
//                     </motion.button>
//                   ))}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Main Content */}
//           <div className="md:col-span-2">
//             <AnimatePresence mode="wait">
//               {selectedContent ? (
//                 selectedContent.type === "quiz" ? (
//                   renderQuizContent()
//                 ) : (
//                   renderNotesContent()
//                 )
//               ) : (
//                 <motion.div
//                   key="placeholder"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className="bg-white p-8 rounded-lg shadow-lg text-center"
//                 >
//                   <motion.h1
//                     initial={{ x: -50, opacity: 0 }}
//                     animate={{ x: 0, opacity: 1 }}
//                     className="text-2xl font-bold text-teal-700"
//                   >
//                     {category.title}
//                   </motion.h1>
//                   <motion.p
//                     initial={{ x: -50, opacity: 0 }}
//                     animate={{ x: 0, opacity: 1 }}
//                     className="text-xl text-teal-600 mt-4"
//                   >
//                     {category.description}
//                   </motion.p>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Right Sidebar */}
//           <div className="md:col-span-1">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white p-6 rounded-lg shadow-lg mb-8"
//             >
//               <h2 className="text-xl font-semibold mb-4 text-teal-700">
//                 Placements
//               </h2>
//               {renderCarousel(placements, "placement")}
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white p-6 rounded-lg shadow-lg"
//             >
//               <h2 className="text-xl font-semibold mb-4 text-teal-700">
//                 Hackathons
//               </h2>
//               {renderCarousel(hackathons, "hackathon")}
//             </motion.div>
//           </div>
//         </div>
//       </div>

//       {/* Alert Message */}
//       <AnimatePresence>
//         {alertMessage && (
//           <motion.div
//             initial={{ opacity: 0, y: -50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -50 }}
//             className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
//               alertMessage.type === "success" ? "bg-emerald-500" : "bg-red-500"
//             } text-white z-50`}
//           >
//             {alertMessage.text}
//           </motion.div>
//         )}
//       </AnimatePresence>

//     </div>
//   );
// }

// export default CategoryPage;


import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "tailwindcss/tailwind.css";
import { TailSpin } from "react-loader-spinner";
import confetti from "canvas-confetti";

function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [content, setContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [error, setError] = useState(null);
  const [contentSearchTerm, setContentSearchTerm] = useState("");
  const [quizSearchTerm, setQuizSearchTerm] = useState("");
  const [placements, setPlacements] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const quizContainerRef = useRef(null);
  const [showExplanation, setShowExplanation] = useState({});
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, placementsRes, hackathonsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/categories/slug/${slug}`),
          axios.get("http://localhost:5000/api/placements"),
          axios.get("http://localhost:5000/api/hackathons"),
        ]);
        setCategory(categoryRes.data);
        const contentRes = await axios.get(
          `http://localhost:5000/api/content/category/${categoryRes.data._id}`
        );
        setContent(contentRes.data);
        setPlacements(placementsRes.data);
        setHackathons(hackathonsRes.data);
        document.title = categoryRes.data.title;
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error.response?.status === 404
            ? "Category not found"
            : "An error occurred while fetching data"
        );
      }
    };
    fetchData();
  }, [slug]);

  const showAlert = useCallback((text, type) => {
    setAlertMessage({ text, type });
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  }, []);

  const sanitizeAndRenderContent = (htmlContent) => ({
    __html: DOMPurify.sanitize(htmlContent, {
      ADD_TAGS: ["math", "mrow", "mi", "mo", "mn", "msup", "mfrac", "img", "pre", "code"],
      ADD_ATTR: ["display", "xmlns", "src", "alt", "class", "style"],
    }),
  });

  const renderContent = (text) => {
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$|<pre[\s\S]*?<\/pre>)/);
    return parts.map((part, index) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        return <MathJax key={index}>{`\\[${part.slice(2, -2)}\\]`}</MathJax>;
      } else if (part.startsWith("$") && part.endsWith("$")) {
        return <MathJax key={index}>{`\\(${part.slice(1, -1)}\\)`}</MathJax>;
      } else if (part.startsWith("<pre") && part.endsWith("</pre>")) {
        return (
          <div
            key={index}
            dangerouslySetInnerHTML={sanitizeAndRenderContent(part)}
          />
        );
      } else {
        return (
          <span key={index}>
            {part.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                <span
                  dangerouslySetInnerHTML={sanitizeAndRenderContent(line)}
                />
              </React.Fragment>
            ))}
          </span>
        );
      }
    });
  };

  const handleContentClick = (content) => {
    setSelectedContent(content);
    setUserAnswers({});
    setQuizSubmitted(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setSidebarOpen(false);
  };

  const handleOptionSelect = (questionIndex, option) => {
    if (!quizSubmitted) {
      setUserAnswers((prev) => ({ ...prev, [questionIndex]: option }));
      const isCorrect = option === selectedContent.questions[questionIndex].correctAnswer;
      showAlert(
        isCorrect ? "Correct answer!" : "Wrong answer. Try again!",
        isCorrect ? "success" : "error"
      );
    }
  };

  const handleQuizSubmit = () => {
    let newScore = 0;
    selectedContent.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
    setQuizSubmitted(true);
    if (newScore === selectedContent.questions.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const renderQuizContent = () => {
    if (!selectedContent || selectedContent.type !== "quiz") return null;
    const filteredQuestions = selectedContent.questions.filter((question) =>
      question.question.toLowerCase().includes(quizSearchTerm.toLowerCase())
    );
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white p-6 rounded-lg shadow-lg"
        ref={quizContainerRef}
      >
        <h2 className="text-3xl font-bold mb-6 text-[#4A90E2]">
          {selectedContent.title}
        </h2>
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search questions..."
              value={quizSearchTerm}
              onChange={(e) => setQuizSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pr-10 border-2 border-[#4A90E2] rounded-lg focus:outline-none focus:border-[#50E3C2] transition-colors"
            />
            <Search className="absolute right-3 top-3 text-[#4A90E2]" />
          </div>
        </div>
        {filteredQuestions.length > 0 ? (
          <div>
            {filteredQuestions.map((question, questionIndex) => (
              <div
                key={questionIndex}
                className="mb-8 p-4 bg-[#F0F8FF] rounded-lg"
              >
                <p className="text-xl font-semibold text-[#4A90E2] mb-4">
                  <span className="font-bold">
                    Question {questionIndex + 1}:
                  </span>{" "}
                  <MathJaxContext>
                    {renderContent(question.question)}
                  </MathJaxContext>
                </p>
                {question.image && (
                  <img
                    src={question.image}
                    alt={`Question ${questionIndex + 1}`}
                    className="mb-4 max-w-full h-auto rounded-lg shadow-md"
                  />
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {["a", "b", "c", "d"].map((option, optionIndex) => (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleOptionSelect(questionIndex, option);
                        const isCorrect = option === question.correctAnswer;
                        setAlertMessage({
                          text: isCorrect
                            ? "Correct answer!"
                            : "Wrong answer. Try again!",
                          type: isCorrect ? "success" : "error",
                        });
                      }}
                      className={`p-4 rounded-lg text-left transition-colors relative ${
                        userAnswers[questionIndex] === option
                          ? "bg-[#4A90E2] text-white"
                          : "bg-[#E6F3FF] text-[#4A90E2] hover:bg-[#B3D9FF]"
                      }`}
                    >
                      <span className="font-semibold mr-2">
                        {option.toUpperCase()}.
                      </span>
                      <MathJaxContext>
                        {renderContent(question.options[optionIndex])}
                      </MathJaxContext>
                    </motion.button>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setShowExplanation((prevState) => ({
                      ...prevState,
                      [questionIndex]: !prevState[questionIndex],
                    }))
                  }
                  className="mt-2 bg-[#4A90E2] text-white px-4 py-2 rounded-lg hover:bg-[#3A7BC8] transition-colors"
                >
                  {showExplanation[questionIndex] ? "Hide" : "Show"} Answer
                </motion.button>
                <AnimatePresence>
                  {showExplanation[questionIndex] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-[#E6F3FF] rounded-lg"
                    >
                      <h3 className="text-lg font-semibold text-[#4A90E2] mb-2">
                        Correct Answer: {question.correctAnswer.toUpperCase()}
                      </h3>
                      <h3 className="text-lg font-semibold text-[#4A90E2] mb-2">
                        Explanation:
                      </h3>
                      <MathJaxContext>
                        {renderContent(question.explanation)}
                      </MathJaxContext>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#4A90E2] text-lg">
            No matching questions found.
          </p>
        )}
      </motion.div>
    );
  };

  const renderNotesContent = () => {
    if (!selectedContent || selectedContent.type !== "notes") return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-[#4A90E2]">
          {selectedContent.title}
        </h2>
        <div className="prose prose-lg max-w-none">
          <MathJaxContext>
            {renderContent(selectedContent.description)}
          </MathJaxContext>
        </div>
        <p className="mt-8 text-sm text-[#50E3C2]">
          Last updated:{" "}
          {new Date(selectedContent.lastUpdated).toLocaleDateString()}
        </p>
      </motion.div>
    );
  };

  const renderCarousel = (items, type) => (
    <Carousel
      showArrows={true}
      showStatus={false}
      showThumbs={false}
      infiniteLoop={true}
      autoPlay={true}
      interval={3000}
      className="mb-8"
    >
      {items.map((item) => (
        <motion.div
          key={item._id}
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
          onClick={() => navigate("/events", { state: { type, item } })}
        >
          <img
            src={type === "placement" ? item.logo : item.bannerLogoLink}
            alt={
              type === "placement"
                ? `${item.companyName} Logo`
                : `${item.instituteOrCompany} Banner`
            }
            className="w-full h-48 object-contain mb-4"
          />
          <h3 className="text-xl font-semibold text-[#4A90E2]">
            {type === "placement" ? item.companyName : item.instituteOrCompany}
          </h3>
          <p className="text-[#50E3C2]">
            {type === "placement" ? item.jobTitle : `${item.eventType} Event`}
          </p>
        </motion.div>
      ))}
    </Carousel>
  );

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-500 text-center mt-8 text-xl"
      >
        {error}
      </motion.div>
    );
  }

  if (!category) {
    return (
      <div className="flex justify-center items-center mt-16">
        <TailSpin height="80" width="80" color="#4A90E2" ariaLabel="loading" />
      </div>
    );
  }

  const filteredContent = content.filter((item) =>
    item.title.toLowerCase().includes(contentSearchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-r from-[#4A90E2] to-[#50E3C2] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <AnimatePresence>
            {(sidebarOpen || window.innerWidth >= 768) && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg sticky top-20"
              >
                <h2 className="text-2xl font-semibold mb-4 text-[#4A90E2]">
                  Content
                </h2>
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search content..."
                      value={contentSearchTerm}
                      onChange={(e) => setContentSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border-2 border-[#4A90E2] rounded-md focus:outline-none focus:border-[#50E3C2] transition-colors"
                    />
                    <Search className="absolute right-3 top-3 text-[#4A90E2]" />
                  </div>
                </div>
                <div className="space-y-2">
                  {filteredContent.map((item, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleContentClick(item)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                        selectedContent && selectedContent._id === item._id
                          ? "bg-[#4A90E2] text-white"
                          : "bg-[#E6F3FF] text-[#4A90E2] hover:bg-[#B3D9FF]"
                      }`}
                    >
                      {item.title}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Main Content */}
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {selectedContent ? (
                selectedContent.type === "quiz" ? (
                  renderQuizContent()
                ) : (
                  renderNotesContent()
                )
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white p-8 rounded-lg shadow-lg text-center"
                >
                  <motion.h1
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-2xl font-bold text-[#4A90E2]"
                  >
                    {category.title}
                  </motion.h1>
                  <motion.p
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-xl text-[#50E3C2] mt-4"
                  >
                    {category.description}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Right Sidebar */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-lg mb-8"
            >
              <h2 className="text-2xl font-semibold mb-4 text-[#4A90E2]">
                Placements
              </h2>
              {renderCarousel(placements, "placement")}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-4 text-[#4A90E2]">
                Hackathons
              </h2>
              {renderCarousel(hackathons, "hackathon")}
            </motion.div>
          </div>
        </div>
      </div>
      {/* Mobile Menu Button */}
      <motion.button
        className="md:hidden fixed bottom-4 right-4 bg-[#4A90E2] text-white p-4 rounded-full shadow-lg z-50"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </motion.button>
      {/* Alert Message */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
              alertMessage.type === "success" ? "bg-[#50E3C2]" : "bg-red-500"
            } text-white z-50`}
          >
            {alertMessage.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CategoryPage;