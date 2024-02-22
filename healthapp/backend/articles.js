const fetch = require('node-fetch'); // If you're using this in Node.js
module.exports = { searchArticles, fetchSummaries, runExample };

const searchTerm = 'asthma';
const maxResults = 5;
const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';

// Function to search articles
async function searchArticles(term, maxResults) {
  const searchUrl = `${baseUrl}esearch.fcgi?db=pubmed&term=${encodeURIComponent(term)}&retmax=${maxResults}&retmode=json`;
  
  const response = await fetch(searchUrl);
  const data = await response.json();
  return data.esearchresult.idlist;
}

// Function to fetch article summaries
async function fetchSummaries(idList) {
  const summariesUrl = `${baseUrl}esummary.fcgi?db=pubmed&id=${idList.join(',')}&retmode=json`;
  
  const response = await fetch(summariesUrl);
  const data = await response.json();
  return data.result;
}

// Example usage
async function runExample() {
  try {
    const articleIds = await searchArticles(searchTerm, maxResults);
    if (articleIds.length > 0) {
      const summaries = await fetchSummaries(articleIds);
      // Assuming summaries is an object where each key is a PMID and the value is the article summary
      Object.values(summaries).forEach(article => {
        if (article) {
          const title = article.title ?? 'No title available';
          const pubDate = article.pubdate ?? 'No publication date available';
          const articleUrl = `https://pubmed.ncbi.nlm.nih.gov/${article.uid}/`;
          console.log(`Title: ${title}, Published Date: ${pubDate}, URL: ${articleUrl}`);
        }
      });
    } else {
      console.log("No articles found for the given search term.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

runExample();
