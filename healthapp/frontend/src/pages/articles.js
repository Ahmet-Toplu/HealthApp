import React, { useEffect, useState } from 'react';
import '../css/contact.css';

export const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('localhost:8081/api/articles'); // Replace with your server's API endpoint
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  return (
    <div style={{ padding: '40px 20px 20px' }}>
      <div className='contact-container'>
        <h1 className='contact-title'>Articles</h1>
        <table className='contact-table'>
          <thead>
            <tr>
              <th>URL</th>
              <th>Title</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.article_id}>
                <td>{article.link && <a href={article.link} target="_blank" rel="noopener noreferrer">{article.link}</a>}</td>
                <td>{article.title}</td>
                <td>{article.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
