import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Preferences } from '@capacitor/preferences';

export const ForumPage = () => {
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchId = async () => {
        const { value } = await Preferences.get({ key: 'id' });
        if (value) {
            setUserId(value);
        }
    };

    fetchId();
}, []);

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
      user_id: userId,
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
          <div style={{ padding: '40px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', backgroundColor: 'white', borderRadius: '10px', zIndex: 100 }}>
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
