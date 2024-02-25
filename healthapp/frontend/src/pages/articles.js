import React, { useEffect, useState } from 'react';

export const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/articles'); // Replace with your server's API endpoint
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  return (
    <div>
      <h1>Articles</h1>
      <table>
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
              <td>{article.link}</td>
              <td>{article.title}</td>
              <td>{article.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
