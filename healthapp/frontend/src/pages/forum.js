import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const ForumPage = () => {
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8081/api/get_questions')
      .then(response => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch(error => console.error("There was an error fetching the questions: ", error));
  }, []);

  const fetchQuestions = () => {
    setLoading(true);
    axios.get('http://localhost:8081/api/get_questions')
      .then(response => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the questions: ", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQuestions(); // Call on component mount
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const questionData = {
      title: questionTitle,
      description: questionDescription,
    };
    
    axios.post('http://localhost:8081/api/add_questions', questionData)
      .then(() => {
        setQuestionTitle('');
        setQuestionDescription('');
        setShowModal(false); // Close the modal on successful submission
        fetchQuestions(); // Refetch all questions after adding a new one
      })
      .catch(error => console.error("There was an error posting the question: ", error));
  };

  return (
    <div className='mx-3 mt-3'>
      <div style={{ padding: '40px 20px 20px', height: '100vh', width: '100%' }}>
        <h1>Health Forum</h1>
        <button onClick={() => setShowModal(true)}>Post a Question</button>
        {loading ? <p>Loading questions...</p> : questions.map(question => (
          <div key={question.id}>
            <h2>{question.title}</h2>
            <p>{question.description}</p>
          </div>
        ))}
        {showModal && (
          <div style={{ position: 'fixed', top: '20%', left: '25%', backgroundColor: 'white', padding: '20px', borderRadius: '10px', zIndex: 100 }}>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Title</label>
                <input
                  type="text"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  value={questionDescription}
                  onChange={(e) => setQuestionDescription(e.target.value)}
                />
              </div>
              <button type="submit">Submit Question</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
