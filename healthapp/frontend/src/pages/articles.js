import React, { useState, useCallback } from "react";
import axios from "axios";

export const Articles = () => {
  const [query, setQuery] = useState("");
  const [articleIds, setArticleIds] = useState([]); // Define articleIds state

  const fetchArticles = useCallback(() => {
    if (!query.trim()) {
      console.error("Query is empty");
      return;
    }

    axios
      .get(
        `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}`
      )
      .then((response) => {
        // Process response here
        console.log(response);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");

        const ids = Array.from(xmlDoc.querySelectorAll("Id")).map(
          (idNode) => idNode.textContent
        );
        setArticleIds(ids); // Update articleIds state with fetched article IDs
      })
      .catch((error) => {
        console.error("Error fetching Articles:", error);
      });
  }, [query]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div>
      <input
        name="queryBox"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter your query..."
      />
      <button onClick={fetchArticles}>Get Articles</button>
      <ul>
        {/* Use articleIds state to render the list of article IDs */}
        {articleIds.map((articleId) => (
          <li key={articleId}>{articleId}</li>
        ))}
      </ul>
      {/* If you want to display articleIds as text, you can render it like this */}
      <div>{articleIds.join(", ")}</div>
    </div>
  );
};
