const fetch = require('node-fetch'); // If you're using this in Node.js

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
      console.log("Fetched article summaries:", summaries);
    } else {
      console.log("No articles found for the given search term.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

runExample();
