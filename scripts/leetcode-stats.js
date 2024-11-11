const api = "https://leetcode-api-faisalshohag.vercel.app/";
const username = "lucifer9199";
// Optional CORS proxy to bypass CORS issues if needed
const corsProxy = "https://cors-anywhere.herokuapp.com/";

// Fetch data from the API
async function fetchData() {
  try {
    const response = await fetch(`${corsProxy}${api}${username}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();

    // Populate the stats in the HTML
    document.getElementById("total-solved").textContent = data.totalSolved || "-";
    document.getElementById("ranking").textContent = data.ranking || "-";
    document.getElementById("contribution-points").textContent = data.contributionPoint || "-";
    document.getElementById("reputation").textContent = data.reputation || "-";
    document.getElementById("total-questions").textContent = data.totalQuestions || "-";

    // Populate submissions breakdown
    const submissionsList = document.getElementById("submissions-breakdown");
    submissionsList.innerHTML = ""; // Clear existing entries
    const difficulties = ["All", "Easy", "Medium", "Hard"];
    data.matchedUserStats.acSubmissionNum.forEach((item, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${difficulties[index]}: ${item.count}`;
      submissionsList.appendChild(listItem);
    });

  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("data-container").innerHTML = "<p>Error fetching data. Please try again later.</p>";
  }
}

// Load data on page load
document.addEventListener("DOMContentLoaded", fetchData);
