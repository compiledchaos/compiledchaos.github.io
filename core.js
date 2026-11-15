function submitWaste() {
      const name = document.getElementById('customerName').value.trim();
      const note = document.getElementById('wasteNote').value.trim();
      const fileInput = document.getElementById('wastePhoto');

      if (!name || !note || !fileInput.files[0]) {
        alert("Please fill in all fields and select a photo.");
        return;
      }

      const reader = new FileReader();
      reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
          // Compress image to save localStorage space
          const canvas = document.createElement('canvas');
          const maxWidth = 400;
          const scale = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

          // Save to localStorage
          const records = JSON.parse(localStorage.getItem('bioWasteDB')) || [];
          records.unshift({
            id: Date.now(),
            name: name,
            note: note,
            image: compressedDataUrl,
            grade: null,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });

          localStorage.setItem('bioWasteDB', JSON.stringify(records));
          
          // Reset form and refresh list
          document.getElementById('customerName').value = '';
          document.getElementById('wasteNote').value = '';
          fileInput.value = '';
          renderSubmissions();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(fileInput.files[0]);
    }

    function renderSubmissions() {
      const records = JSON.parse(localStorage.getItem('bioWasteDB')) || [];
      const list = document.getElementById('submissionsList');
      
      if (records.length === 0) {
        list.innerHTML = "<p>No drop-offs submitted yet.</p>";
        return;
      }

      list.innerHTML = records.map(item => `
        <div class="item">
          <img src="${item.image}" alt="Bio waste">
          <div>
            <strong>${item.name}</strong> (${item.timestamp})<br>
            <span>${item.note}</span><br><br>
            ${item.grade 
              ? `<span class="badge graded">Grade: ${item.grade}</span>` 
              : `<span class="badge pending">Pending Admin Review</span>`
            }
          </div>
        </div>
      `).join('');
    }

    // Refresh automatically if admin updates grade in another tab
    window.addEventListener('storage', renderSubmissions);
    renderSubmissions();