const api = "https://leetcode-api-faisalshohag.vercel.app/";
const username = "lucifer9199";

function fetchData() {
  fetch(api + username)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      document.getElementById("total-solved").textContent = data.totalSolved;
      document.getElementById("ranking").textContent = data.ranking;
      document.getElementById("contribution-points").textContent =
        data.contributionPoint;
      document.getElementById("reputation").textContent = data.reputation;
      document.getElementById("total-questions").textContent =
        data.totalQuestions;
      const submissionsList = document.getElementById("submissions-breakdown");
      const difficulties = ["All", "Easy", "Medium", "Hard"];
      for (let i = 0; i < difficulties.length; i++) {
        const difficulty = difficulties[i];
        const solved = data.matchedUserStats.acSubmissionNum[i].count;
        const listItem = document.createElement("li");
        listItem.innerHTML = `${difficulty}: ${solved}`;
        submissionsList.appendChild(listItem);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      document.getElementById("data-container").innerHTML =
        "<p>Error fetching data. Please try again later.</p>";
    });
}

fetch(api)
  .then(() => {
    fetchData();
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
