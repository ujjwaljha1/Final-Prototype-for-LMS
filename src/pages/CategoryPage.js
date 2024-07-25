import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';

function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [content, setContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [error, setError] = useState(null);
  const [showAnswers, setShowAnswers] = useState({});
  const [contentSearchTerm, setContentSearchTerm] = useState('');
  const [quizSearchTerm, setQuizSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategoryAndContent = async () => {
      try {
        const categoryResponse = await axios.get(`http://localhost:5000/api/categories/${id}`);
        setCategory(categoryResponse.data);
        const contentResponse = await axios.get(`http://localhost:5000/api/content/category/${id}`);
        setContent(contentResponse.data);
      } catch (error) {
        console.error('Error fetching category and content:', error);
        setError(error.response?.status === 404 ? 'Category not found' : 'An error occurred while fetching data');
      }
    };
    fetchCategoryAndContent();
  }, [id]);

  const sanitizeAndRenderContent = (htmlContent) => ({
    __html: DOMPurify.sanitize(htmlContent, {
      ADD_TAGS: ['math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'mfrac', 'img'],
      ADD_ATTR: ['display', 'xmlns', 'src', 'alt', 'class'],
    }),
  });

  const handleContentClick = (content) => {
    setSelectedContent(content);
    setShowAnswers({});
  };

  const handleShowAnswer = (index) => {
    setShowAnswers(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(contentSearchTerm.toLowerCase())
  );

  const renderLatex = (text) => {
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/);
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        return <MathJax key={index}>{`\\[${part.slice(2, -2)}\\]`}</MathJax>;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        return <MathJax key={index}>{`\\(${part.slice(1, -1)}\\)`}</MathJax>;
      } else {
        return <span key={index} dangerouslySetInnerHTML={sanitizeAndRenderContent(part)} />;
      }
    });
  };

  const renderQuizContent = () => {
    if (!selectedContent || selectedContent.type !== 'quiz') return null;

    const filteredQuestions = selectedContent.questions.filter(question =>
      question.question.toLowerCase().includes(quizSearchTerm.toLowerCase())
    );

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Quiz: {selectedContent.title}</h2>
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search questions..."
              value={quizSearchTerm}
              onChange={(e) => setQuizSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pr-10 border rounded-md"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question, index) => (
            <div key={index} className="mb-8 pb-8 border-b">
              <MathJaxContext>
                <p className="text-lg mb-4">
                  <span className="font-bold">Question {index + 1}:</span>{' '}
                  {renderLatex(question.question)}
                </p>
              </MathJaxContext>
              {question.image && (
                <img src={question.image} alt={`Question ${index + 1}`} className="mb-4 max-w-full h-auto" />
              )}
              <div className="mt-4">
                {['a', 'b', 'c', 'd'].map((option, optionIndex) => (
                  <div key={option} className="mb-2 flex items-start">
                    <span className="font-semibold mr-2 mt-1">{option.toUpperCase()}.</span>
                    <MathJaxContext>
                      {renderLatex(question.options[optionIndex])}
                    </MathJaxContext>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleShowAnswer(index)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4 flex items-center"
              >
                {showAnswers[index] ? 'Hide Answer' : 'Show Answer'}
                {showAnswers[index] ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
              </button>
              <AnimatePresence>
                {showAnswers[index] && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 bg-gray-100 p-4 rounded-md"
                  >
                    <div className="font-semibold mb-2">Correct Answer: {question.correctAnswer.toUpperCase()}</div>
                    <MathJaxContext>
                      {renderLatex(question.explanation)}
                    </MathJaxContext>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        ) : (
          <p>No matching questions found.</p>
        )}
      </div>
    );
  };

  const renderNotesContent = () => {
    if (!selectedContent || selectedContent.type !== 'notes') return null;

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{selectedContent.title}</h2>
        <MathJaxContext>
          {renderLatex(selectedContent.description)}
        </MathJaxContext>
        <p className="mt-4 text-sm text-gray-500">
          Last updated: {new Date(selectedContent.lastUpdated).toLocaleDateString()}
        </p>
      </div>
    );
  };

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (!category) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{category.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Content</h2>
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search content..."
                value={contentSearchTerm}
                onChange={(e) => setContentSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pr-10 border rounded-md"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
          {filteredContent.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => handleContentClick(item)}
              className={`w-full text-left px-4 py-3 rounded-md mb-2 transition-colors ${
                selectedContent && selectedContent._id === item._id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {item.title}
            </motion.button>
          ))}
        </div>
        <div className="md:col-span-2">
          {selectedContent ? (
            selectedContent.type === 'quiz' ? renderQuizContent() : renderNotesContent()
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-500">Select content to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
