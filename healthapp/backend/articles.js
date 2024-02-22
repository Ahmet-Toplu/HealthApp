const fetch = require('node-fetch'); // If you're using this in Node.js
module.exports = { searchArticles, fetchSummaries, runExample };

const medicalConditions = [
  "Asthma", "Diabetes Mellitus", "Hypertension", "Obesity", "Depression", "Anxiety Disorders",
  "Heart Failure", "Stroke", "Chronic Kidney Disease", "Arthritis", "COVID-19", "Influenza",
  "Tuberculosis", "HIV/AIDS", "Epilepsy", "Alzheimer's Disease", "Parkinson's Disease",
  "Osteoporosis", "Chronic Obstructive Pulmonary Disease", "Hepatitis B", "Hepatitis C",
  "Malaria", "Dengue Fever", "Zika Virus", "Chikungunya", "Lyme Disease", "Psoriasis",
  "Rheumatoid Arthritis", "Multiple Sclerosis", "Crohn's Disease", "Ulcerative Colitis",
  "Cystic Fibrosis", "Sickle Cell Anemia", "Hemophilia", "Thalassemia", "Lupus",
  "Scleroderma", "Melanoma", "Breast Cancer", "Prostate Cancer", "Lung Cancer", "Colorectal Cancer",
  "Pancreatic Cancer", "Leukemia", "Lymphoma", "Ovarian Cancer", "Bladder Cancer",
  "Cervical Cancer", "Endometriosis", "Polycystic Ovary Syndrome", "Erectile Dysfunction",
  "Infertility", "Acne", "Rosacea", "Eczema", "Alopecia Areata", "Vitiligo", "Oral Cancer",
  "Glaucoma", "Cataract", "Macular Degeneration", "Diabetic Retinopathy", "Bipolar Disorder",
  "Schizophrenia", "Post-traumatic Stress Disorder", "Obsessive-Compulsive Disorder",
  "Attention Deficit Hyperactivity Disorder", "Autism Spectrum Disorder", "Anorexia Nervosa",
  "Bulimia Nervosa", "Conjunctivitis", "Otitis Media", "Sinusitis", "Tonsillitis", "Pneumonia",
  "Bronchitis", "Peptic Ulcer", "Irritable Bowel Syndrome", "Gastroesophageal Reflux Disease",
  "Gallstones", "Kidney Stones", "Urinary Tract Infection", "Appendicitis", "Hernia",
  "Varicose Veins", "Deep Vein Thrombosis", "Peripheral Artery Disease", "Aneurysm",
  "Hypothyroidism", "Hyperthyroidism", "Addison's Disease", "Cushing's Syndrome",
  "Diabetic Ketoacidosis", "Hyperglycemic Hyperosmolar State", "Acute Myocardial Infarction",
  "Angina Pectoris", "Atrial Fibrillation", "Heart Block", "Cardiomyopathy", "Endocarditis",
  "Myocarditis", "Pericarditis", "Pulmonary Embolism", "Pulmonary Hypertension", "Sarcoidosis"
];

const maxResults = 10;
const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';

// Function to search articles
async function searchArticles(term, maxResults) {
  const searchUrl = `${baseUrl}esearch.fcgi?db=pubmed&term=${encodeURIComponent(term)}&retmax=${maxResults}&retmode=json`;
  
  try {
    const response = await fetch(searchUrl);
    const data = await response.json();
    // Check if 'esearchresult' and 'idlist' exist and are valid
    if (data.esearchresult && Array.isArray(data.esearchresult.idlist)) {
      return data.esearchresult.idlist;
    } else {
      // Log warning and return an empty array if 'idlist' is not present
      console.warn(`No IDs found for condition: ${term}.`, data);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching articles for condition: ${term}:`, error);
    return []; // Return an empty array in case of error to allow the loop to continue
  }
}


// Function to fetch article summaries
async function fetchSummaries(idList) {
  if (!idList || idList.length === 0) {
    // Return an empty object or appropriate response if there are no IDs to fetch summaries for
    return {};
  }
  const summariesUrl = `${baseUrl}esummary.fcgi?db=pubmed&id=${idList.join(',')}&retmode=json`;
  
  const response = await fetch(summariesUrl);
  const data = await response.json();
  return data.result;
}

function delay(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
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
