function renderAdminList() {
      const records = JSON.parse(localStorage.getItem('bioWasteDB')) || [];
      const list = document.getElementById('adminList');

      if (records.length === 0) {
        list.innerHTML = "<p>No submissions to grade yet. Upload a photo on the Customer page first!</p>";
        return;
      }

      list.innerHTML = records.map(item => `
        <div class="card">
          <img src="${item.image}" alt="Uploaded waste">
          <div>
            <strong>Customer:</strong> ${item.name} (${item.timestamp})<br>
            <strong>Notes:</strong> ${item.note}<br>
            <strong>Current Status:</strong> ${item.grade ? item.grade : "Unreviewed"}
            <div class="controls">
              <button class="btn-a" onclick="gradeItem(${item.id}, 'Grade A - Pure Organic (100 pts)')">Grade A</button>
              <button class="btn-b" onclick="gradeItem(${item.id}, 'Grade B - Minor Sorting Needed (50 pts)')">Grade B</button>
              <button class="btn-c" onclick="gradeItem(${item.id}, 'Rejected - Contains Plastic (0 pts)')">Reject</button>
            </div>
          </div>
        </div>
      `).join('');
    }

    function gradeItem(id, gradeText) {
      const records = JSON.parse(localStorage.getItem('bioWasteDB')) || [];
      const updated = records.map(item => {
        if (item.id === id) {
          item.grade = gradeText;
        }
        return item;
      });
      localStorage.setItem('bioWasteDB', JSON.stringify(updated));
      renderAdminList();
    }

    function clearDatabase() {
      if (confirm("Delete all test submissions?")) {
        localStorage.removeItem('bioWasteDB');
        renderAdminList();
      }
    }

    // Refresh automatically if customer uploads in another tab
    window.addEventListener('storage', renderAdminList);
    renderAdminList();