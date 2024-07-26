

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import DOMPurify from "dompurify";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";

// function AdminPanel() {
//   const [categories, setCategories] = useState([]);
//   const [newCategory, setNewCategory] = useState({
//     title: "",
//     description: "",
//     image: "",
//     type: "notes",
//   });
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [content, setContent] = useState([]);
//   const [newContent, setNewContent] = useState({
//     title: "",
//     description: "",
//     categoryId: "",
//     type: "notes",
//     questions: [],
//   });
//   const [editingContent, setEditingContent] = useState(null);
//   const [showWarnings, setShowWarnings] = useState(false);
//   const [quizEntryMethod, setQuizEntryMethod] = useState("manual");
//   const [quizJson, setQuizJson] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedContent, setExpandedContent] = useState(null);

//   useEffect(() => {
//     fetchCategories();
//     fetchContent();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/categories");
//       setCategories(response.data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       setError("Failed to fetch categories. Please try again later.");
//     }
//   };

//   const fetchContent = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get("http://localhost:5000/api/content");
//       if (Array.isArray(response.data)) {
//         setContent(response.data);
//       } else {
//         throw new Error("Received invalid data format");
//       }
//     } catch (error) {
//       console.error("Error fetching content:", error);
//       setError(error.response?.data?.message || error.message || "Failed to fetch content. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };
  

//   const handleInputChange = (e, target) => {
//     const { name, value } = e.target;
//     if (target === "newCategory") {
//       setNewCategory((prev) => ({ ...prev, [name]: value }));
//     } else if (target === "editingCategory") {
//       setEditingCategory((prev) => ({ ...prev, [name]: value }));
//     } else if (target === "newContent") {
//       setNewContent((prev) => ({ ...prev, [name]: value }));
//     } else if (target === "editingContent") {
//       setEditingContent((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const sanitizeHtml = (html) => {
//     return DOMPurify.sanitize(html, {
//       ADD_TAGS: ["math", "mrow", "mi", "mo", "mn", "msup", "mfrac", "img"],
//       ADD_ATTR: ["display", "xmlns", "src", "alt"],
//     });
//   };

//   const handleCategorySubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const categoryData = editingCategory || newCategory;
//       if (editingCategory) {
//         await axios.put(
//           `http://localhost:5000/api/categories/${editingCategory._id}`,
//           categoryData
//         );
//         setEditingCategory(null);
//       } else {
//         await axios.post("http://localhost:5000/api/categories", categoryData);
//         setNewCategory({
//           title: "",
//           description: "",
//           image: "",
//           type: "notes",
//         });
//       }
//       fetchCategories();
//     } catch (error) {
//       console.error("Error submitting category:", error);
//     }
//   };

//   const handleContentSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const contentToSubmit = editingContent || newContent;
//       const sanitizedDescription = sanitizeHtml(contentToSubmit.description);
//       let dataToSend = {
//         ...contentToSubmit,
//         description: sanitizedDescription,
//         category: contentToSubmit.categoryId,
//       };

//       if (contentToSubmit.type === "quiz") {
//         if (quizEntryMethod === "json") {
//           dataToSend.quizJson = quizJson;
//         } else {
//           dataToSend.questions = contentToSubmit.questions;
//         }
//       }

//       if (editingContent) {
//         await axios.put(
//           `http://localhost:5000/api/content/${editingContent._id}`,
//           dataToSend
//         );
//         setEditingContent(null);
//       } else {
//         await axios.post("http://localhost:5000/api/content", dataToSend);
//         setNewContent({
//           title: "",
//           description: "",
//           categoryId: "",
//           type: "notes",
//           questions: [],
//         });
//         setQuizJson("");
//       }
//       fetchContent();
//     } catch (error) {
//       console.error(
//         "Error submitting content:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   const handleDelete = async (id, type) => {
//     try {
//       if (type === "category") {
//         await axios.delete(`http://localhost:5000/api/categories/${id}`);
//         fetchCategories();
//       } else if (type === "content") {
//         await axios.delete(`http://localhost:5000/api/content/${id}`);
//         fetchContent();
//       }
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   const handleEdit = (item, type) => {
//     if (type === "category") {
//       setEditingCategory(item);
//     } else if (type === "content") {
//       setEditingContent({ ...item, categoryId: item.category });
//     }
//   };

//   const handleQuestionChange = (index, field, value) => {
//     setNewContent((prev) => {
//       const updatedQuestions = [...prev.questions];
//       updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
//       return { ...prev, questions: updatedQuestions };
//     });
//   };

//   const handleOptionChange = (questionIndex, optionIndex, value) => {
//     setNewContent((prev) => {
//       const updatedQuestions = [...prev.questions];
//       updatedQuestions[questionIndex].options[optionIndex] = value;
//       return { ...prev, questions: updatedQuestions };
//     });
//   };

//   const addQuestion = () => {
//     setNewContent((prev) => ({
//       ...prev,
//       questions: [
//         ...prev.questions,
//         {
//           question: "",
//           options: ["", "", "", ""],
//           correctAnswer: "",
//           explanation: "",
//           image: "",
//         },
//       ],
//     }));
//   };

//   const toggleExpandContent = (id) => {
//     setExpandedContent(expandedContent === id ? null : id);
//   };

//   const renderWarnings = () => (
//     <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
//       <p className="font-bold">Warnings and Tips:</p>
//       <ul className="list-disc pl-5">
//         <li>You can write your own HTML code in the description fields.</li>
//         <li>
//           To include images, use the &lt;img&gt; tag with src attribute, e.g.,
//           &lt;img src="https://example.com/image.jpg" alt="Description"&gt;
//         </li>
//         <li>
//           To write math equations, use LaTeX syntax surrounded by $ for inline
//           equations or $$ for display equations.
//         </li>
//         <li>
//           Use &lt;h1&gt;, &lt;h2&gt;, &lt;h3&gt; for headings, &lt;p&gt; for
//           paragraphs, &lt;ul&gt; and &lt;li&gt; for lists.
//         </li>
//         <li>
//           Tables can be created using the &lt;table&gt;, &lt;tr&gt;, &lt;th&gt;,
//           and &lt;td&gt; tags.
//         </li>
//         <li>
//           For more complex math formatting, refer to LaTeX documentation or use
//           tools like MathJax for rendering.
//         </li>
//       </ul>
//     </div>
//   );

//   const renderContentItem = (item) => (
//     <motion.li
//       key={item._id}
//       layout
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
//     >
//       <div className="flex justify-between items-center">
//         <h3 className="text-xl font-semibold text-blue-600">{item.title}</h3>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => toggleExpandContent(item._id)}
//             className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
//           >
//             {expandedContent === item._id ? <FaChevronUp /> : <FaChevronDown />}
//           </button>
//           <button
//             onClick={() => handleEdit(item, "content")}
//             className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
//           >
//             <FaEdit />
//           </button>
//           <button
//             onClick={() => handleDelete(item._id, "content")}
//             className="text-red-500 hover:text-red-600 transition-colors duration-200"
//           >
//             <FaTrash />
//           </button>
//         </div>
//       </div>
//       <AnimatePresence>
//         {expandedContent === item._id && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.3 }}
//             className="mt-4"
//           >
//             {item.type === "notes" ? (
//               <div
//                 dangerouslySetInnerHTML={{
//                   __html: sanitizeHtml(item.description),
//                 }}
//                 className="text-gray-600 prose max-w-none"
//               ></div>
//             ) : (
//               <div>
//                 <p className="text-gray-600">
//                   Number of questions:{" "}
//                   {item.questions ? item.questions.length : "N/A"}
//                 </p>
//                 {/* You can add a preview of quiz questions here if needed */}
//               </div>
//             )}
//             <p className="text-sm text-gray-500 mt-2">
//               Category: {item.category ? item.category.title : "N/A"}
//             </p>
//             <p className="text-sm text-gray-500">Type: {item.type}</p>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.li>
//   );

  

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="container mx-auto mt-8 px-4"
//     >
//       <motion.h1
//         initial={{ y: -50 }}
//         animate={{ y: 0 }}
//         transition={{ type: "spring", stiffness: 100 }}
//         className="text-4xl font-bold mb-8 text-center text-blue-600"
//       >
//         Admin Panel
//       </motion.h1>

//       {/* Category Management */}
//       <motion.section
//         initial={{ x: -100 }}
//         animate={{ x: 0 }}
//         transition={{ type: "spring", stiffness: 100 }}
//         className="mb-12 bg-white p-6 rounded-lg shadow-lg"
//       >
//         <h2 className="text-2xl font-semibold mb-4 text-blue-500">
//           {editingCategory ? "Edit Category" : "Add New Category"}
//         </h2>
//         <form onSubmit={handleCategorySubmit} className="max-w-md">
//           <input
//             type="text"
//             name="title"
//             value={editingCategory ? editingCategory.title : newCategory.title}
//             onChange={(e) =>
//               handleInputChange(
//                 e,
//                 editingCategory ? "editingCategory" : "newCategory"
//               )
//             }
//             placeholder="Category Title"
//             className="w-full px-3 py-2 border rounded-lg mb-4"
//             required
//           />
//           <textarea
//             name="description"
//             value={
//               editingCategory
//                 ? editingCategory.description
//                 : newCategory.description
//             }
//             onChange={(e) =>
//               handleInputChange(
//                 e,
//                 editingCategory ? "editingCategory" : "newCategory"
//               )
//             }
//             placeholder="Category Description"
//             className="w-full px-3 py-2 border rounded-lg mb-4"
//             required
//           ></textarea>
//           <input
//             type="text"
//             name="image"
//             value={editingCategory ? editingCategory.image : newCategory.image}
//             onChange={(e) =>
//               handleInputChange(
//                 e,
//                 editingCategory ? "editingCategory" : "newCategory"
//               )
//             }
//             placeholder="Image URL"
//             className="w-full px-3 py-2 border rounded-lg mb-4"
//           />
//           <select
//             name="type"
//             value={editingCategory ? editingCategory.type : newCategory.type}
//             onChange={(e) =>
//               handleInputChange(
//                 e,
//                 editingCategory ? "editingCategory" : "newCategory"
//               )
//             }
//             className="w-full px-3 py-2 border rounded-lg mb-4"
//             required
//           >
//             <option value="notes">Notes</option>
//             <option value="quiz">Quiz</option>
//           </select>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//           >
//             {editingCategory ? "Update Category" : "Add Category"}
//           </button>
//           {editingCategory && (
//             <button
//               type="button"
//               onClick={() => setEditingCategory(null)}
//               className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
//             >
//               Cancel
//             </button>
//           )}
//         </form>
//       </motion.section>

//       {/* Existing Categories */}
//       <motion.section
//         initial={{ x: 100 }}
//         animate={{ x: 0 }}
//         transition={{ type: "spring", stiffness: 100 }}
//         className="mb-12 bg-white p-6 rounded-lg shadow-lg"
//       >
//         <h2 className="text-2xl font-semibold mb-4 text-blue-500">
//           Existing Categories
//         </h2>
//         <ul className="space-y-4">
//           {categories.map((category) => (
//             <motion.li
//               key={category._id}
//               className="p-4 bg-gray-100 rounded-lg hover:shadow-md transition-shadow duration-300"
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <h3 className="text-xl font-semibold">{category.title}</h3>
//               <p className="text-gray-600">{category.description}</p>
//               <p className="text-gray-600">Type: {category.type}</p>
//               {category.image && (
//                 <img
//                   src={category.image}
//                   alt={category.title}
//                   className="mt-2 h-32 object-cover rounded"
//                 />
//               )}
//               <div className="mt-2">
//                 <button
//                   onClick={() => handleEdit(category, "category")}
//                   className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 mr-2"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(category._id, "category")}
//                   className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </motion.li>
//           ))}
//         </ul>
//       </motion.section>

//       {/* Content Management */}
//       <motion.section
//         initial={{ y: 100 }}
//         animate={{ y: 0 }}
//         transition={{ type: "spring", stiffness: 100 }}
//         className="mb-12 bg-white p-6 rounded-lg shadow-lg"
//       >
//         <h2 className="text-2xl font-semibold mb-4 text-blue-500">
//           {editingContent ? "Edit Content" : "Add New Content"}
//         </h2>
//         <button
//           onClick={() => setShowWarnings(!showWarnings)}
//           className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//         >
//           {showWarnings ? "Hide" : "Show"} Warnings and Tips
//         </button>
//         {showWarnings && renderWarnings()}
//         <form onSubmit={handleContentSubmit} className="max-w-2xl">
//           <select
//             name="categoryId"
//             value={
//               editingContent ? editingContent.categoryId : newContent.categoryId
//             }
//             onChange={(e) => {
//               handleInputChange(
//                 e,
//                 editingContent ? "editingContent" : "newContent"
//               );
//               const selectedCategory = categories.find(
//                 (cat) => cat._id === e.target.value
//               );
//               if (selectedCategory) {
//                 if (editingContent) {
//                   setEditingContent((prev) => ({
//                     ...prev,
//                     type: selectedCategory.type,
//                   }));
//                 } else {
//                   setNewContent((prev) => ({
//                     ...prev,
//                     type: selectedCategory.type,
//                   }));
//                 }
//               }
//             }}
//             className="w-full px-3 py-2 border rounded-lg mb-4"
//             required
//           >
//             <option value="">Select Category</option>
//             {categories.map((category) => (
//               <option key={category._id} value={category._id}>
//                 {category.title}
//               </option>
//             ))}
//           </select>
//           <input
//             type="text"
//             name="title"
//             value={editingContent ? editingContent.title : newContent.title}
//             onChange={(e) =>
//               handleInputChange(
//                 e,
//                 editingContent ? "editingContent" : "newContent"
//               )
//             }
//             placeholder="Content Title"
//             className="w-full px-3 py-2 border rounded-lg mb-4"
//             required
//           />
//           <textarea
//             name="description"
//             value={
//               editingContent
//                 ? editingContent.description
//                 : newContent.description
//             }
//             onChange={(e) =>
//               handleInputChange(
//                 e,
//                 editingContent ? "editingContent" : "newContent"
//               )
//             }
//             placeholder="Content Description (You can use HTML here)"
//             className="w-full px-3 py-2 border rounded-lg mb-4 h-64"
//             required
//           ></textarea>
//           {(editingContent ? editingContent.type : newContent.type) ===
//             "quiz" && (
//             <>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Quiz Entry Method:
//                 </label>
//                 <select
//                   value={quizEntryMethod}
//                   onChange={(e) => setQuizEntryMethod(e.target.value)}
//                   className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//                 >
//                   <option value="manual">Enter Manually</option>
//                   <option value="json">Upload JSON</option>
//                 </select>
//               </div>
//               {quizEntryMethod === "json" ? (
//                 <textarea
//                   value={quizJson}
//                   onChange={(e) => setQuizJson(e.target.value)}
//                   placeholder="Paste your JSON here"
//                   className="w-full px-3 py-2 border rounded-lg mb-4 h-64"
//                   required
//                 ></textarea>
//               ) : (
//                 <>
//                   <input
//                     type="number"
//                     name="numberOfQuestions"
//                     value={newContent.questions.length}
//                     onChange={(e) => {
//                       const num = parseInt(e.target.value);
//                       setNewContent((prev) => ({
//                         ...prev,
//                         questions: Array(num)
//                           .fill()
//                           .map(
//                             (_, i) =>
//                               prev.questions[i] || {
//                                 question: "",
//                                 options: ["", "", "", ""],
//                                 correctAnswer: "",
//                                 explanation: "",
//                                 image: "",
//                               }
//                           ),
//                       }));
//                     }}
//                     placeholder="Number of Questions"
//                     className="w-full px-3 py-2 border rounded-lg mb-4"
//                     min="1"
//                     required
//                   />
//                   {newContent.questions.map((question, index) => (
//                     <motion.div
//                       key={index}
//                       className="mb-4 p-4 border rounded bg-gray-50"
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                     >
//                       <h3 className="font-semibold mb-2 text-blue-600">
//                         Question {index + 1}
//                       </h3>
//                       <textarea
//                         value={question.question}
//                         onChange={(e) =>
//                           handleQuestionChange(
//                             index,
//                             "question",
//                             e.target.value
//                           )
//                         }
//                         placeholder="Question (You can use HTML here)"
//                         className="w-full px-3 py-2 border rounded-lg mb-2 h-24"
//                       ></textarea>
//                       {question.options.map((option, optionIndex) => (
//                         <textarea
//                           key={optionIndex}
//                           value={option}
//                           onChange={(e) =>
//                             handleOptionChange(
//                               index,
//                               optionIndex,
//                               e.target.value
//                             )
//                           }
//                           placeholder={`Option ${String.fromCharCode(
//                             97 + optionIndex
//                           )} (You can use HTML here)`}
//                           className="w-full px-3 py-2 border rounded-lg mb-2 h-16"
//                         ></textarea>
//                       ))}
//                       <div className="mb-2">
//                         <label className="block text-sm font-medium text-gray-700">
//                           Correct Answer:
//                         </label>
//                         <div className="mt-1 flex space-x-4">
//                           {["a", "b", "c", "d"].map((option) => (
//                             <label
//                               key={option}
//                               className="inline-flex items-center"
//                             >
//                               <input
//                                 type="radio"
//                                 name={`correctAnswer-${index}`}
//                                 value={option}
//                                 checked={question.correctAnswer === option}
//                                 onChange={(e) =>
//                                   handleQuestionChange(
//                                     index,
//                                     "correctAnswer",
//                                     e.target.value
//                                   )
//                                 }
//                                 className="form-radio h-4 w-4 text-blue-600"
//                               />
//                               <span className="ml-2">
//                                 {option.toUpperCase()}
//                               </span>
//                             </label>
//                           ))}
//                         </div>
//                       </div>
//                       <textarea
//                         value={question.explanation}
//                         onChange={(e) =>
//                           handleQuestionChange(
//                             index,
//                             "explanation",
//                             e.target.value
//                           )
//                         }
//                         placeholder="Explanation (Optional, you can use HTML here)"
//                         className="w-full px-3 py-2 border rounded-lg mb-2 h-24"
//                       ></textarea>
//                       <input
//                         type="text"
//                         value={question.image}
//                         onChange={(e) =>
//                           handleQuestionChange(index, "image", e.target.value)
//                         }
//                         placeholder="Image URL (Optional)"
//                         className="w-full px-3 py-2 border rounded-lg mb-2"
//                       />
//                     </motion.div>
//                   ))}
//                   <button
//                     type="button"
//                     onClick={addQuestion}
//                     className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mb-4"
//                   >
//                     Add Question
//                   </button>
//                 </>
//               )}
//             </>
//           )}
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//           >
//             {editingContent ? "Update Content" : "Add Content"}
//           </button>
//           {editingContent && (
//             <button
//               type="button"
//               onClick={() => setEditingContent(null)}
//               className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
//             >
//               Cancel
//             </button>
//           )}
//         </form>
//       </motion.section>

//       {/* Existing Content */}
//       {/* Existing Content */}
//       <motion.section
//         initial={{ y: 100 }}
//         animate={{ y: 0 }}
//         transition={{ type: "spring", stiffness: 100 }}
//         className="mb-12 bg-gray-100 p-6 rounded-lg shadow-lg"
//       >
//         <h2 className="text-2xl font-semibold mb-4 text-blue-500">
//           Existing Content
//         </h2>
//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : error ? (
//           <div className="text-red-500 text-center">{error}</div>
//         ) : content.length === 0 ? (
//           <div className="text-gray-500 text-center">
//             No content available. Start by adding some!
//           </div>
//         ) : (
//           <>
//             <p className="mb-4 text-gray-600">
//               Total content items: {content.length}
//             </p>
//             <motion.ul layout className="space-y-4">
//               <AnimatePresence>
//                 {content.map(renderContentItem)}
//               </AnimatePresence>
//             </motion.ul>
//           </>
//         )}
//       </motion.section>
//     </motion.div>
//   );
// }

// export default AdminPanel;






import React, { useState, useEffect } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaPlus, FaInfo } from "react-icons/fa";

function AdminPanel() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    title: "",
    description: "",
    image: "",
    type: "notes",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [content, setContent] = useState([]);
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    categoryId: "",
    type: "notes",
    questions: [],
  });
  const [editingContent, setEditingContent] = useState(null);
  const [showWarnings, setShowWarnings] = useState(false);
  const [quizEntryMethod, setQuizEntryMethod] = useState("manual");
  const [quizJson, setQuizJson] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedContent, setExpandedContent] = useState(null);
  const [activeTab, setActiveTab] = useState("categories");

  useEffect(() => {
    fetchCategories();
    fetchContent();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories. Please try again later.");
    }
  };

  const fetchContent = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/content");
      if (Array.isArray(response.data)) {
        setContent(response.data);
      } else {
        throw new Error("Received invalid data format");
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setError(error.response?.data?.message || error.message || "Failed to fetch content. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, target) => {
    const { name, value } = e.target;
    if (target === "newCategory") {
      setNewCategory((prev) => ({ ...prev, [name]: value }));
    } else if (target === "editingCategory") {
      setEditingCategory((prev) => ({ ...prev, [name]: value }));
    } else if (target === "newContent") {
      setNewContent((prev) => ({ ...prev, [name]: value }));
    } else if (target === "editingContent") {
      setEditingContent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const sanitizeHtml = (html) => {
    return DOMPurify.sanitize(html, {
      ADD_TAGS: ["math", "mrow", "mi", "mo", "mn", "msup", "mfrac", "img"],
      ADD_ATTR: ["display", "xmlns", "src", "alt"],
    });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryData = editingCategory || newCategory;
      if (editingCategory) {
        await axios.put(
          `http://localhost:5000/api/categories/${editingCategory._id}`,
          categoryData
        );
        setEditingCategory(null);
      } else {
        await axios.post("http://localhost:5000/api/categories", categoryData);
        setNewCategory({
          title: "",
          description: "",
          image: "",
          type: "notes",
        });
      }
      fetchCategories();
    } catch (error) {
      console.error("Error submitting category:", error);
    }
  };

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    try {
      const contentToSubmit = editingContent || newContent;
      const sanitizedDescription = sanitizeHtml(contentToSubmit.description);
      let dataToSend = {
        ...contentToSubmit,
        description: sanitizedDescription,
        category: contentToSubmit.categoryId,
      };
      if (contentToSubmit.type === "quiz") {
        if (quizEntryMethod === "json") {
          dataToSend.quizJson = quizJson;
        } else {
          dataToSend.questions = contentToSubmit.questions;
        }
      }
      if (editingContent) {
        await axios.put(
          `http://localhost:5000/api/content/${editingContent._id}`,
          dataToSend
        );
        setEditingContent(null);
      } else {
        await axios.post("http://localhost:5000/api/content", dataToSend);
        setNewContent({
          title: "",
          description: "",
          categoryId: "",
          type: "notes",
          questions: [],
        });
        setQuizJson("");
      }
      fetchContent();
    } catch (error) {
      console.error(
        "Error submitting content:",
        error.response?.data || error.message
      );
    }
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === "category") {
        await axios.delete(`http://localhost:5000/api/categories/${id}`);
        fetchCategories();
      } else if (type === "content") {
        await axios.delete(`http://localhost:5000/api/content/${id}`);
        fetchContent();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEdit = (item, type) => {
    if (type === "category") {
      setEditingCategory(item);
    } else if (type === "content") {
      setEditingContent({ ...item, categoryId: item.category });
    }
  };

  const handleQuestionChange = (index, field, value) => {
    setNewContent((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setNewContent((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex].options[optionIndex] = value;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const addQuestion = () => {
    setNewContent((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          explanation: "",
          image: "",
        },
      ],
    }));
  };

  const toggleExpandContent = (id) => {
    setExpandedContent(expandedContent === id ? null : id);
  };

  const renderWarnings = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
    >
      <h3 className="font-bold mb-2">Warnings and Tips:</h3>
      <ul className="list-disc list-inside">
        <li>You can write your own HTML code in the description fields.</li>
        <li>
          To include images, use the &lt;img&gt; tag with src attribute, e.g.,
          &lt;img src="https://example.com/image.jpg" alt="Description"&gt;
        </li>
        <li>
          To write math equations, use LaTeX syntax surrounded by $ for inline
          equations or $$ for display equations.
        </li>
        <li>
          Use &lt;h1&gt;, &lt;h2&gt;, &lt;h3&gt; for headings, &lt;p&gt; for
          paragraphs, &lt;ul&gt; and &lt;li&gt; for lists.
        </li>
        <li>
          Tables can be created using the &lt;table&gt;, &lt;tr&gt;, &lt;th&gt;,
          and &lt;td&gt; tags.
        </li>
        <li>
          For more complex math formatting, refer to LaTeX documentation or use
          tools like MathJax for rendering.
        </li>
      </ul>
    </motion.div>
  );

  const renderContentItem = (item) => (
    <motion.div
      key={item._id}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white shadow-md rounded-lg p-4 mb-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => toggleExpandContent(item._id)}
            className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
          >
            {expandedContent === item._id ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          <button
            onClick={() => handleEdit(item, "content")}
            className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(item._id, "content")}
            className="text-red-500 hover:text-red-600 transition-colors duration-200"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {expandedContent === item._id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <p className="text-gray-600 mb-2">
              {item.type === "notes" ? (
                <div dangerouslySetInnerHTML={{ __html: item.description }} />
              ) : (
                <div>
                  <p className="font-semibold">Number of questions: {item.questions ? item.questions.length : "N/A"}</p>
                  {/* You can add a preview of quiz questions here if needed */}
                </div>
              )}
            </p>
            <p className="text-sm text-gray-500">
              Category: {item.category ? item.category.title : "N/A"}
            </p>
            <p className="text-sm text-gray-500">Type: {item.type}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      <div className="mb-8">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "categories"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "content"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Content
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "categories" && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-semibold mb-4">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <form onSubmit={handleCategorySubmit} className="mb-8">
                <input
                  type="text"
                  name="title"
                  value={editingCategory ? editingCategory.title : newCategory.title}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      editingCategory ? "editingCategory" : "newCategory"
                    )
                  }
                  placeholder="Category Title"
                  className="w-full px-3 py-2 border rounded-lg mb-4"
                  required
                />
                <textarea
                  name="description"
                  value={
                    editingCategory ? editingCategory.description : newCategory.description
                  }
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      editingCategory ? "editingCategory" : "newCategory"
                    )
                  }
                  placeholder="Category Description"
                  className="w-full px-3 py-2 border rounded-lg mb-4"
                  required
                />
                <input
                  type="text"
                  name="image"
                  value={editingCategory ? editingCategory.image : newCategory.image}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      editingCategory ? "editingCategory" : "newCategory"
                    )
                  }
                  placeholder="Image URL"
                  className="w-full px-3 py-2 border rounded-lg mb-4"
                />
                <select
                  name="type"
                  value={editingCategory ? editingCategory.type : newCategory.type}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      editingCategory ? "editingCategory" : "newCategory"
                    )
                  }
                  className="w-full px-3 py-2 border rounded-lg mb-4"
                  required
                >
                  <option value="notes">Notes</option>
                  <option value="quiz">Quiz</option>
                </select>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  {editingCategory ? "Update Category" : "Add Category"}
                </button>
                {editingCategory && (
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                )}
              </form>

              <h3 className="text-xl font-semibold mb-4">Existing Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <motion.div
                    key={category._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white shadow-md rounded-lg p-4"
                  >
                    <h4 className="text-lg font-semibold mb-2">{category.title}</h4>
                    <p className="text-gray-600 mb-2">{category.description}</p>
                    <p className="text-sm text-gray-500 mb-2">Type: {category.type}</p>
                    {category.image && (
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                    )}
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(category, "category")}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id, "category")}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "content" && (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-semibold mb-4">
                {editingContent ? "Edit Content" : "Add New Content"}
              </h2>
              <button
                onClick={() => setShowWarnings(!showWarnings)}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
              >
                <FaInfo className="mr-2" />
                {showWarnings ? "Hide" : "Show"} Warnings and Tips
              </button>
              <AnimatePresence>
                {showWarnings && renderWarnings()}
              </AnimatePresence>
              <form onSubmit={handleContentSubmit} className="mb-8">
                <select
                  name="categoryId"
                  value={editingContent ? editingContent.categoryId : newContent.categoryId}
                  onChange={(e) => {
                    handleInputChange(
                      e,
                      editingContent ? "editingContent" : "newContent"
                    );
                    const selectedCategory = categories.find(
                      (cat) => cat._id === e.target.value
                    );
                    if (selectedCategory) {
                      if (editingContent) {
                        setEditingContent((prev) => ({
                          ...prev,
                          type: selectedCategory.type,
                        }));
                      } else {
                        setNewContent((prev) => ({
                          ...prev,
                          type: selectedCategory.type,
                        }));
                      }
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-lg mb-4"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="title"
                  value={editingContent ? editingContent.title : newContent.title}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      editingContent ? "editingContent" : "newContent"
                    )
                  }
                  placeholder="Content Title"
                  className="w-full px-3 py-2 border rounded-lg mb-4"
                  required
                />
                <textarea
                  name="description"
                  value={
                    editingContent ? editingContent.description : newContent.description
                  }
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      editingContent ? "editingContent" : "newContent"
                    )
                  }
                  placeholder="Content Description (You can use HTML here)"
                  className="w-full px-3 py-2 border rounded-lg mb-4 h-64"
                  required
                />
                {(editingContent ? editingContent.type : newContent.type) === "quiz" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quiz Entry Method:
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="manual"
                          checked={quizEntryMethod === "manual"}
                          onChange={(e) => setQuizEntryMethod(e.target.value)}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">Enter Manually</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="json"
                          checked={quizEntryMethod === "json"}
                          onChange={(e) => setQuizEntryMethod(e.target.value)}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">Upload JSON</span>
                      </label>
                    </div>
                  </div>
                )}
                {(editingContent ? editingContent.type : newContent.type) === "quiz" &&
                  quizEntryMethod === "json" ? (
                  <textarea
                    value={quizJson}
                    onChange={(e) => setQuizJson(e.target.value)}
                    placeholder="Paste your JSON here"
                    className="w-full px-3 py-2 border rounded-lg mb-4 h-64"
                    required
                  />
                ) : (editingContent ? editingContent.type : newContent.type) === "quiz" ? (
                  <>
                    <input
                      type="number"
                      onChange={(e) => {
                        const num = parseInt(e.target.value);
                        setNewContent((prev) => ({
                          ...prev,
                          questions: Array(num)
                            .fill()
                            .map(
                              (_, i) =>
                                prev.questions[i] || {
                                  question: "",
                                  options: ["", "", "", ""],
                                  correctAnswer: "",
                                  explanation: "",
                                  image: "",
                                }
                            ),
                        }));
                      }}
                      placeholder="Number of Questions"
                      className="w-full px-3 py-2 border rounded-lg mb-4"
                      min="1"
                      required
                    />
                    {newContent.questions.map((question, index) => (
                      <div key={index} className="mb-6 p-4 border rounded-lg">
                        <h4 className="text-lg font-semibold mb-2">Question {index + 1}</h4>
                        <textarea
                          value={question.question}
                          onChange={(e) =>
                            handleQuestionChange(
                              index,
                              "question",
                              e.target.value
                            )
                          }
                          placeholder="Question (You can use HTML here)"
                          className="w-full px-3 py-2 border rounded-lg mb-2 h-24"
                        />
                        {question.options.map((option, optionIndex) => (
                          <input
                            key={optionIndex}
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(
                                index,
                                optionIndex,
                                e.target.value
                              )
                            }
                            placeholder={`Option ${String.fromCharCode(
                              97 + optionIndex
                            )} (You can use HTML here)`}
                            className="w-full px-3 py-2 border rounded-lg mb-2"
                          />
                        ))}
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correct Answer:
                          </label>
                          <div className="flex space-x-4">
                            {["a", "b", "c", "d"].map((option) => (
                              <label key={option} className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name={`correctAnswer_${index}`}
                                  value={option}
                                  checked={question.correctAnswer === option}
                                  onChange={(e) =>
                                    handleQuestionChange(
                                      index,
                                      "correctAnswer",
                                      e.target.value
                                    )
                                  }
                                  className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2">{option.toUpperCase()}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <textarea
                          value={question.explanation}
                          onChange={(e) =>
                            handleQuestionChange(
                              index,
                              "explanation",
                              e.target.value
                            )
                          }
                          placeholder="Explanation (Optional, you can use HTML here)"
                          className="w-full px-3 py-2 border rounded-lg mb-2 h-24"
                        />
                        <input
                          type="text"
                          value={question.image}
                          onChange={(e) => handleQuestionChange(index, "image", e.target.value)}
                          placeholder="Image URL (Optional)"
                          className="w-full px-3 py-2 border rounded-lg mb-2"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mb-4"
                    >
                      <FaPlus className="inline-block mr-2" />
                      Add Question
                    </button>
                  </>
                ) : null}
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  {editingContent ? "Update Content" : "Add Content"}
                </button>
                {editingContent && (
                  <button
                    onClick={() => setEditingContent(null)}
                    className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                )}
              </form>

              <h3 className="text-xl font-semibold mb-4">Existing Content</h3>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              ) : content.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No content available. Start by adding some!
                </p>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">
                    Total content items: {content.length}
                  </p>
                  <motion.div layout className="space-y-4">
                    <AnimatePresence>
                      {content.map(renderContentItem)}
                    </AnimatePresence>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminPanel;