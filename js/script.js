const jobList = document.getElementById("job-list");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const categoryInput = document.getElementById("category-input");

let allJobs = [];

// Function to display jobs
function displayJobs(jobArray) {
  jobList.innerHTML = "";

  if (jobArray.length === 0) {
    jobList.innerHTML = `<p class="text-center">No jobs found.</p>`;
    return;
  }

  jobArray.forEach(job => {
    const jobCard = `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${job.title}</h5>
            <p class="card-text fw-semibold">${job.company_name}</p>
          </div>

          <ul class="list-group list-group-flush">
            <li class="list-group-item">${job.candidate_required_location || "Remote"}</li>
            <li class="list-group-item">${job.job_type || "Not Specified"}</li>
            <li class="list-group-item">${job.category || "General"}</li>
          </ul>

          <div class="card-body d-flex gap-2">
            <a href="${job.url}" target="_blank" class="btn btn-primary w-50">Apply</a>
            <button 
              class="btn btn-outline-success w-50 save-btn"
              data-title="${job.title}"
              data-company="${job.company_name}"
              data-location="${job.candidate_required_location || "Remote"}"
              data-type="${job.job_type || "Not Specified"}"
              data-category="${job.category || "General"}"
              data-url="${job.url}">
              Save Job
            </button>
          </div>
        </div>
      </div>
    `;

    jobList.innerHTML += jobCard;
  });

  // VERY IMPORTANT: attach listeners AFTER cards are created
  addSaveEventListeners();
}

// Function to fetch jobs from API
async function fetchJobs() {
  try {
    const response = await fetch("https://remotive.com/api/remote-jobs");
    const data = await response.json();

    allJobs = data.jobs.slice(0, 12); // show only first 12 jobs
    displayJobs(allJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    jobList.innerHTML = `<p class="text-danger text-center">Failed to load jobs. Please try again later.</p>`;
  }
}

// Search functionality
searchBtn.addEventListener("click", () => {
  const searchValue = searchInput.value.toLowerCase();
  const categoryValue = categoryInput.value.toLowerCase();

  const filteredJobs = allJobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchValue) ||
      job.company_name.toLowerCase().includes(searchValue);

    const matchesCategory =
      job.category.toLowerCase().includes(categoryValue);

    return matchesSearch && matchesCategory;
  });

  displayJobs(filteredJobs);
});

// Add save button listeners
function addSaveEventListeners() {
  const saveButtons = document.querySelectorAll(".save-btn");

  saveButtons.forEach(button => {
    button.addEventListener("click", () => {
      const job = {
        title: button.dataset.title,
        company: button.dataset.company,
        location: button.dataset.location,
        type: button.dataset.type,
        category: button.dataset.category,
        url: button.dataset.url
      };

      saveJob(job);
    });
  });
}

// Save job to localStorage
function saveJob(job) {
  let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];

  const alreadySaved = savedJobs.some(saved => saved.url === job.url);

  if (alreadySaved) {
    alert("This job is already saved!");
    return;
  }

  savedJobs.push(job);
  localStorage.setItem("savedJobs", JSON.stringify(savedJobs));

  alert("Job saved successfully!");
}

// Load jobs when page opens
fetchJobs();
