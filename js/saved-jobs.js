const savedJobList = document.getElementById("saved-job-list");

function loadSavedJobs() {
  const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];

  if (savedJobs.length === 0) {
    savedJobList.innerHTML = `<p class="text-center">No saved jobs yet.</p>`;
    return;
  }

  savedJobs.forEach((job, index) => {
    const jobCard = `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${job.title}</h5>
            <p class="card-text fw-semibold">${job.company}</p>
          </div>

          <ul class="list-group list-group-flush">
            <li class="list-group-item">${job.location}</li>
            <li class="list-group-item">${job.type}</li>
            <li class="list-group-item">${job.category}</li>
          </ul>

          <div class="card-body d-flex gap-2">
            <a href="${job.url}" target="_blank" class="btn btn-primary w-50">Apply</a>
            <button class="btn btn-danger w-50 delete-btn" data-index="${index}">
              Remove
            </button>
          </div>
        </div>
      </div>
    `;

    savedJobList.innerHTML += jobCard;
  });

  addDeleteListeners();
}

function addDeleteListeners() {
  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach(button => {
    button.addEventListener("click", () => {
      const index = button.dataset.index;

      let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
      savedJobs.splice(index, 1);

      localStorage.setItem("savedJobs", JSON.stringify(savedJobs));

      loadSavedJobs(); // reload UI
    });
  });
}

// Load saved jobs when page opens
loadSavedJobs();
