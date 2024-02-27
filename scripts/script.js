const today = new Date();
const dob = new Date("2003-08-15");
const birthDate = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
const ageInYears = today.getFullYear() - birthDate.getFullYear();
const ageInDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));

// Update age on the page
document.getElementById(
  "age"
).textContent = `Last Checkpoint: ${ageInYears} years, ${ageInDays} days`;
