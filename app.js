/* Organic Waste to Wealth — shared prototype logic.
   Data is stored in this browser using localStorage. It is not a production backend.
*/
(() => {
  "use strict";

  const STORAGE_KEY = "oww_submissions_v1";
  const ORDER_KEY = "oww_orders_v1";
  const DELIVERY_FEE = 50;
  const rates = {
    "Vegetable waste": 3,
    "Fruit waste": 2,
    "Onion waste": 4,
    "Garlic waste": 5,
    "Mixed organic waste": 1,
    "Other plant-based waste": 2
  };

  const readList = (key) => {
    try { return JSON.parse(localStorage.getItem(key) || "[]"); }
    catch { return []; }
  };
  const writeList = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const money = (value) => "₹" + Number(value || 0).toFixed(2).replace(/\.00$/, "");
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[ch]);
  const makeId = () => "OWW-" + Math.random().toString(36).slice(2, 8).toUpperCase();
/*
  function initCustomer() {
    const form = document.getElementById("waste-form");
    if (!form) return;

    const category = document.getElementById("waste-category");
    const weight = form.elements.weight;
    const rateDisplay = document.getElementById("rate-display");
    const estimateDisplay = document.getElementById("estimate-display");
    const photoInput = document.getElementById("waste-photo");
    const preview = document.getElementById("photo-preview");
    const methodInputs = [...form.querySelectorAll('input[name="method"]')];
    const locationLabel = document.getElementById("location-label");
    const locationInput = document.getElementById("location-input");

    function updateEstimate() {
      const data = new FormData(form);
      const rate = rates[category.value];
      const qty = Number(weight.value);
      const method = String(data.get("method") || "Drop-off");
      var x;
      if (method == "Pickup") {
          x = (rate * qty) * 0.80;
      }
      else {
        x = 0;
      }
      rateDisplay.textContent = rate ? `${money(rate)} / kg` : "Choose a category";
      estimateDisplay.textContent = rate && qty > 0 ? money((rate * qty) - x) : "₹—";
    }
    category.addEventListener("change", updateEstimate);
    weight.addEventListener("input", updateEstimate);
    methodInputs.forEach(input => input.addEventListener("change", () => {
      const isPickup = form.elements.method.value === "Pickup";
      locationLabel.firstChild.textContent = isPickup ? "Pickup address " : "Preferred drop-off location ";
      locationInput.placeholder = isPickup ? "Enter your pickup address / area" : "Enter preferred collection centre or area";
    }));

    photoInput.addEventListener("change", () => {
      const file = photoInput.files && photoInput.files[0];
      if (!file) { preview.classList.add("hidden"); return; }
      if (!file.type.startsWith("image/")) {
        alert("Please choose an image file.");
        photoInput.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        preview.src = reader.result;
        preview.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const wasteCategory = String(data.get("category") || "");
      const qty = Number(data.get("weight"));
      const method = String(data.get("method") || "Drop-off");
      const location = String(data.get("location") || "").trim();
      const details = String(data.get("details") || "").trim();
      const file = photoInput.files && photoInput.files[0];

      if (!name || !phone || !rates[wasteCategory] || !(qty > 0) || !location) {
        showMessage("submit-message", "Please complete all required fields.", true);
        return;
      }
      if (!/^[0-9+\-\s]{10,16}$/.test(phone)) {
        showMessage("submit-message", "Please enter a valid phone number.", true);
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = "Creating ticket…";

      try {
        let photoData = "";
        if (file) photoData = await compressImage(file);
        const rate = rates[wasteCategory];
        // This prototype uses the selected category as a transparent AI-classification placeholder.
        const ticket = {
          id: makeId(),
          name, phone, category: wasteCategory,
          classification: wasteCategory,
          classificationNote: "Category-assisted prototype classification; not a trained AI result.",
          weight: qty, rate, estimatedAmount: qty * rate,
          method, location, details, photo: photoData,
          status: "Awaiting review",
          actualWeight: null, finalAmount: null,
          createdAt: new Date().toISOString()
        };
        const records = readList(STORAGE_KEY);
        records.unshift(ticket);
        writeList(STORAGE_KEY, records);

        showMessage("submit-message", `Submission saved. Your ticket ID is ${ticket.id}. Keep this ID to look up your submission.`);
        document.getElementById("lookup-id").value = ticket.id;
        renderTicket(ticket);
        form.reset();
        preview.src = "";
        preview.classList.add("hidden");
        updateEstimate();
      } catch (error) {
        showMessage("submit-message", "Could not save this submission in browser storage. Try a smaller photo.", true);
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit waste &amp; generate ticket <span>→</span>';
      }
    });

    document.getElementById("lookup-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const id = document.getElementById("lookup-id").value.trim().toUpperCase();
      const ticket = readList(STORAGE_KEY).find(item => item.id.toUpperCase() === id);
      if (!ticket) {
        document.getElementById("ticket-result").innerHTML = '<p class="form-message error">No ticket found. Check the ID and try again.</p>';
        return;
      }
      renderTicket(ticket);
    });
    updateEstimate();

    const pickup_btn = document.getElementById("pickup");

    pickup_btn.addEventListener("click", function() {
      document.getElementById('address-label').style.display='block'
      document.getElementById('location-label').style.display='none'
    });

    const drop_off_btn = document.getElementById("drop_off");

    drop_off_btn.addEventListener("click", function() {
      document.getElementById('location-label').style.display='block'
      document.getElementById('address-label').style.display='none'
    });
  }
*/
function calculatePayout(rate, qty, method, quality = 1) {
  return rate * qty * (method === "Pickup" ? 0.8 : 1) * quality;
}

function initCustomer() {
  const form = document.getElementById("waste-form");
  if (!form) return;

  const category = document.getElementById("waste-category");
  const weight = form.elements.weight;
  const rateDisplay = document.getElementById("rate-display");
  const estimateDisplay = document.getElementById("estimate-display");
  const photoInput = document.getElementById("waste-photo");
  const preview = document.getElementById("photo-preview");
  const methodInputs = [...form.querySelectorAll('input[name="method"]')];
  const locationLabel = document.getElementById("location-label");
  const addressLabel = document.getElementById("address-label");
  const dropoffLocation = document.getElementById("dropoff-location");
  const pickupLocation = document.getElementById("pickup-location");

  function syncLocationFields() {
    const isPickup = form.elements.method.value === "Pickup";
    if (!locationLabel || !addressLabel || !dropoffLocation || !pickupLocation) return;

    locationLabel.style.display = isPickup ? "none" : "block";
    addressLabel.style.display = isPickup ? "block" : "none";

    dropoffLocation.disabled = isPickup;
    dropoffLocation.style.display = isPickup ? "none" : "block";
    dropoffLocation.name = isPickup ? "" : "location";
    dropoffLocation.required = !isPickup;

    pickupLocation.disabled = !isPickup;
    pickupLocation.style.display = isPickup ? "block" : "none";
    pickupLocation.name = isPickup ? "location" : "";
    pickupLocation.required = isPickup;
  }


  function updateEstimate() {
  const rate = rates[category.value];
  const qty = Number(weight.value);
  const selectedMethod = form.querySelector('input[name="method"]:checked');
  const method = selectedMethod?.value || "Drop-off";

  rateDisplay.textContent = rate ? `${money(rate)} / kg` : "Choose a category";
  estimateDisplay.textContent =
    rate && qty > 0 ? money(calculatePayout(rate, qty, method)) : "₹—";
}

  category.addEventListener("change", updateEstimate);
  weight.addEventListener("input", updateEstimate);

  methodInputs.forEach((input) => {
  input.addEventListener("change", () => {
    syncLocationFields();
    updateEstimate();
  });
});

  if (photoInput) {
    photoInput.addEventListener("change", () => {
      const file = photoInput.files && photoInput.files[0];
      if (!file) {
        preview.classList.add("hidden");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please choose an image file.");
        photoInput.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        preview.src = reader.result;
        preview.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const wasteCategory = String(data.get("category") || "");
    const qty = Number(data.get("weight"));
    const method = String(data.get("method") || "Drop-off");
    const location = String(data.get("location") || "").trim();
    const details = String(data.get("details") || "").trim();
    const file = photoInput && photoInput.files ? photoInput.files[0] : null;

    if (!name || !phone || !rates[wasteCategory] || !(qty > 0) || !location) {
      showMessage("submit-message", "Please complete all required fields.", true);
      return;
    }

    if (!/^[0-9+\-\s]{10,16}$/.test(phone)) {
      showMessage("submit-message", "Please enter a valid phone number.", true);
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Creating ticket…";

    try {
      let photoData = "";
      if (file) photoData = await compressImage(file);

      const rate = rates[wasteCategory];
      const ticket = {
        id: makeId(),
        name,
        phone,
        category: wasteCategory,
        classification: wasteCategory,
        classificationNote: "Category-assisted prototype classification; not a trained AI result.",
        weight: qty,
        rate,
        estimatedAmount: calculatePayout(rate, qty, method),
        method,
        location,
        details,
        photo: photoData,
        status: "Awaiting review",
        actualWeight: null,
        finalAmount: null,
        createdAt: new Date().toISOString()
      };

      const records = readList(STORAGE_KEY);
      records.unshift(ticket);
      writeList(STORAGE_KEY, records);

      showMessage("submit-message", `Submission saved. Your ticket ID is ${ticket.id}. Keep this ID to look up your submission.`);
      document.getElementById("lookup-id").value = ticket.id;
      renderTicket(ticket);

      form.reset();
      preview.src = "";
      preview.classList.add("hidden");
      syncLocationFields();
      updateEstimate();
    } catch (error) {
      showMessage("submit-message", "Could not save this submission in browser storage. Try a smaller photo.", true);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Submit waste &amp; generate ticket <span>→</span>';
    }
  });

  document.getElementById("lookup-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const id = document.getElementById("lookup-id").value.trim().toUpperCase();
    const ticket = readList(STORAGE_KEY).find(item => item.id.toUpperCase() === id);
    if (!ticket) {
      document.getElementById("ticket-result").innerHTML = '<p class="form-message error">No ticket found. Check the ID and try again.</p>';
      return;
    }
    renderTicket(ticket);
  });

  syncLocationFields();
  updateEstimate();
}

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const max = 900;
          const scale = Math.min(1, max / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.68));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function showMessage(id, message, isError = false) {
    const node = document.getElementById(id);
    if (!node) return;
    node.textContent = message;
    node.classList.toggle("error", isError);
  }

  function renderTicket(ticket) {
    const result = document.getElementById("ticket-result");
    if (!result) return;
    const amount = ticket.finalAmount == null ? ticket.estimatedAmount : ticket.finalAmount;
    const weight = ticket.actualWeight == null ? ticket.weight : ticket.actualWeight;
    const statusClass = ticket.status === "Accepted" ? "accepted" : ticket.status === "Completed" ? "completed" : "";
    result.innerHTML = `
      <div class="ticket-card">
        <div class="ticket-id">${escapeHTML(ticket.id)}</div>
        <h3>${escapeHTML(ticket.name)}</h3>
        <span class="status ${statusClass}">${escapeHTML(ticket.status)}</span>
        <div class="ticket-meta">
          <div><span>Mobile</span><b>${escapeHTML(ticket.phone)}</b></div>
          <div><span>AI / category result</span><b>${escapeHTML(ticket.classification)}</b></div>
          <div><span>Quantity</span><b>${escapeHTML(weight)} kg ${ticket.actualWeight != null ? "(verified)" : "(estimated)"}</b></div>
          <div><span>Estimated / current payout</span><b>${money(amount)}</b></div>
          <div><span>Collection method</span><b>${escapeHTML(ticket.method)}</b></div>
          <div><span>Location</span><b>${escapeHTML(ticket.location)}</b></div>
        </div>
        <p class="fine-print">${escapeHTML(ticket.classificationNote || "")} Payment remains subject to physical inspection and approval.</p>
      </div>`;
  }

  function initAdmin() {
    const tbody = document.getElementById("admin-ticket-list");
    const orderTbody = document.getElementById("admin-order-list");
    if (!tbody || !orderTbody) return;
    let selectedId = null;

    function refreshOrders() {
      const orders = readList(ORDER_KEY);
      const query = (document.getElementById("order-search").value || "").toLowerCase();
      const filtered = orders.filter(order => [
        order.id,
        order.farmerName,
        order.phone,
        order.location,
        ...(order.items || []).map(item => item.name)
      ].some(value => String(value).toLowerCase().includes(query)));

      orderTbody.innerHTML = filtered.length ? filtered.map(order => {
        const itemSummary = (order.items || []).map(item =>
          `${item.quantity} ${escapeHTML(item.unit)} × ${escapeHTML(item.name)}`
        ).join("<br>");
        const deliveryFee = order.deliveryFee ?? (order.method === "Pickup" ? DELIVERY_FEE : 0);
        const subtotal = order.subtotal ?? Math.max(0, Number(order.totalAmount || 0) - deliveryFee);
        const fulfillment = order.method === "Pickup" ? "Home delivery" : "Collection point";
        return `
          <tr>
            <td><b>${escapeHTML(order.id)}</b><small>${escapeHTML(order.farmerName)} · ${escapeHTML(order.phone)}</small></td>
            <td><b>${itemSummary || "No items"}</b></td>
            <td>${escapeHTML(fulfillment)}<small>${escapeHTML(order.location)}</small></td>
            <td><b>${money(subtotal)}</b><small>Fee: ${money(deliveryFee)}</small></td>
            <td><b>${money(order.totalAmount)}</b></td>
            <td><span class="status accepted">${escapeHTML(order.status || "Demonstration order")}</span></td>
          </tr>`;
      }).join("") : '<tr><td colspan="6" class="empty-state">No matching farmer orders found.</td></tr>';
    }

    function refresh() {
      const records = readList(STORAGE_KEY);
      document.getElementById("metric-total").textContent = records.length;
      document.getElementById("metric-pending").textContent = records.filter(t => t.status === "Awaiting review").length;
      const accepted = records.filter(t => t.actualWeight != null);
      document.getElementById("metric-weight").textContent = accepted.reduce((sum, t) => sum + Number(t.actualWeight || 0), 0).toFixed(1) + " kg";
      document.getElementById("metric-payout").textContent = money(accepted.reduce((sum, t) => sum + Number(t.finalAmount || 0), 0));
      const query = (document.getElementById("admin-search").value || "").toLowerCase();
      const filtered = records.filter(t => [t.id, t.name, t.phone, t.category].some(v => String(v).toLowerCase().includes(query)));
      tbody.innerHTML = filtered.length ? filtered.map(t => `
        <tr>
          <td><button class="table-link" data-open="${escapeHTML(t.id)}">${escapeHTML(t.id)}</button><small>${escapeHTML(t.name)} · ${escapeHTML(t.phone)}</small></td>
          <td><b>${escapeHTML(t.category)}</b><small>${escapeHTML(t.weight)} kg estimated</small></td>
          <td>${escapeHTML(t.method)}<small>${escapeHTML(t.location)}</small></td>
          <td><b>${money(t.finalAmount == null ? t.estimatedAmount : t.finalAmount)}</b></td>
          <td><span class="status ${t.status === "Accepted" ? "accepted" : t.status === "Completed" ? "completed" : ""}">${escapeHTML(t.status)}</span></td>
          <td><button class="button button-outline" data-open="${escapeHTML(t.id)}">Review</button></td>
        </tr>`).join("") : '<tr><td colspan="6" class="empty-state">No matching tickets found.</td></tr>';
      refreshOrders();
      if (selectedId && records.some(t => t.id === selectedId)) renderAdminDetail(records.find(t => t.id === selectedId));
    }

    function renderAdminDetail(t) {
      const detail = document.getElementById("admin-ticket-detail");
      const actualWeight = t.actualWeight == null ? t.weight : t.actualWeight;
      const displayAmount = t.finalAmount ?? t.estimatedAmount;
      const amountLable = t.finalAmount != null ? "Final payout" : "Current estimate";
      detail.innerHTML = `
        <div class="detail-grid">
          <div class="detail-item"><small>Ticket ID</small><b>${escapeHTML(t.id)}</b></div>
          <div class="detail-item"><small>Customer</small><b>${escapeHTML(t.name)}</b></div>
          <div class="detail-item"><small>Mobile</small><b>${escapeHTML(t.phone)}</b></div>
          <div class="detail-item"><small>Waste category / classification</small><b>${escapeHTML(t.classification)}</b></div>
          <div class="detail-item"><small>Estimated quantity</small><b>${escapeHTML(t.weight)} kg</b></div>
          <div class="detail-item"><small>Submission method</small><b>${escapeHTML(t.method)} · ${escapeHTML(t.location)}</b></div>
          <div class="detail-item"><small>Customer details</small><b>${escapeHTML(t.details || "No additional details")}</b></div>
          <div class="detail-item"><small>${amountLable}</small><b>${money(displayAmount)}</b></div>
        </div>
        ${t.photo ? `<p><img src="${t.photo}" alt="Customer waste upload" style="max-width:180px;max-height:130px;object-fit:cover;border-radius:9px;margin-top:12px"></p>` : ""}
        <div class="admin-controls">
          <label>Verified weight (kg)<input id="verified-weight" type="number" min="0" step="0.1" value="${escapeHTML(actualWeight)}"></label>
          <label>Quality (1-100)<input id="quality_rating" type="number" min="0" step="1" max="100" placeholder="eg. 55"></label>
          <label>Ticket status<select id="verified-status"><option ${t.status === "Awaiting review" ? "selected" : ""}>Awaiting review</option><option ${t.status === "Accepted" ? "selected" : ""}>Accepted</option><option ${t.status === "Completed" ? "selected" : ""}>Completed</option><option ${t.status === "Rejected" ? "selected" : ""}>Rejected</option></select></label>
          <button id="save-review" class="button button-primary" type="button">Save review</button>
        </div>
        <p class="fine-print">Saving an accepted or completed ticket calculates the final demonstration payout using the category rate and verified weight.</p>
        <div id="review-message" class="form-message"></div>`;
      document.getElementById("save-review").addEventListener("click", () => {
        const weight = Number(document.getElementById("verified-weight").value);
        const status = document.getElementById("verified-status").value;
        const quality = (document.getElementById("quality_rating").value) / 100;
        if (!(weight > 0) && status !== "Rejected") {
          showMessage("review-message", "Enter a verified weight greater than zero.", true);
          return;
        }
        const records = readList(STORAGE_KEY);
        const index = records.findIndex(item => item.id === t.id);
        if (index < 0) return;
        records[index].actualWeight = weight > 0 ? weight : null;
        records[index].status = status;
        records[index].finalAmount = (status === "Accepted" || status === "Completed") ? calculatePayout(records[index].rate, weight, t.method, quality) : null;
        writeList(STORAGE_KEY, records);
        selectedId = t.id;
        refresh();
        showMessage("review-message", "Ticket review saved. The customer ticket lookup will show the updated status and amount.");
      });
    }

    tbody.addEventListener("click", event => {
      const button = event.target.closest("[data-open]");
      if (!button) return;
      selectedId = button.dataset.open;
      const ticket = readList(STORAGE_KEY).find(t => t.id === selectedId);
      if (ticket) renderAdminDetail(ticket);
    });
    document.getElementById("admin-search").addEventListener("input", refresh);
    document.getElementById("refresh-tickets").addEventListener("click", refresh);
    document.getElementById("order-search").addEventListener("input", refreshOrders);
    document.getElementById("refresh-orders").addEventListener("click", refreshOrders);
    refresh();
  }

  function initFarmer() {
    const form = document.getElementById("cart-form");
    if (!form) return;
    const grid = document.getElementById("product-grid");
    const methodInputs = [...form.querySelectorAll('input[name="method"]')];
    const locationLabel = document.getElementById("location-label");
    const addressLabel = document.getElementById("address-label");
    const dropoffLocation = document.getElementById("dropoff-location");
    const pickupLocation = document.getElementById("pickup-location");

    function syncLocationFields() {
      const isPickup = form.elements.method.value === "Pickup";
      if (!locationLabel || !addressLabel || !dropoffLocation || !pickupLocation) return;

      locationLabel.style.display = isPickup ? "none" : "block";
      addressLabel.style.display = isPickup ? "block" : "none";

      dropoffLocation.disabled = isPickup;
      dropoffLocation.style.display = isPickup ? "none" : "block";
      dropoffLocation.name = isPickup ? "" : "location";
      dropoffLocation.required = !isPickup;

      pickupLocation.disabled = !isPickup;
      pickupLocation.style.display = isPickup ? "block" : "none";
      pickupLocation.name = isPickup ? "location" : "";
      pickupLocation.required = isPickup;
    }
    methodInputs.forEach((input) => {
      input.addEventListener("change", () => {
        syncLocationFields();
        renderCart();
      });
    });

    if (!grid) return;
    const products = {
      compost: { name: "Organic compost", unit: "kg", price: 12 },
      pesticide: { name: "Allium-based botanical pesticide (R&D concept)", unit: "L", price: 150 },
      biogas: { name: "Biogas", unit: "m³", price: 25 }
    };
    const cart = {};
    const cartItems = document.getElementById("cart-items");

    function renderCart() {
      const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
      const count = entries.reduce((sum, [, qty]) => sum + qty, 0);
      const subtotal = entries.reduce((sum, [key, qty]) => sum + products[key].price * qty, 0);
      const deliveryFee = form.elements.method.value === "Pickup" ? DELIVERY_FEE : 0;
      const total = subtotal + deliveryFee;
      document.getElementById("cart-count").textContent = count;
      document.getElementById("cart-subtotal").textContent = money(subtotal);
      document.getElementById("delivery-fee").textContent = money(deliveryFee);
      document.getElementById("cart-total").textContent = money(total);
      document.getElementById("place-order").disabled = count === 0;
      cartItems.innerHTML = entries.length ? entries.map(([key, qty]) => `
        <div class="cart-row"><span><b>${escapeHTML(products[key].name)}</b><br><small>${qty} ${products[key].unit} × ${money(products[key].price)}</small></span><span>${money(qty * products[key].price)} <button data-remove="${key}" type="button">Remove</button></span></div>`).join("") : '<p class="muted">Your cart is empty. Add a product to begin.</p>';
    }

    grid.addEventListener("click", event => {
      const button = event.target.closest("[data-product]");
      if (!button) return;
      const key = button.dataset.product;
      cart[key] = (cart[key] || 0) + 1;
      renderCart();
      showMessage("order-message", `${products[key].name} added to your demonstration cart.`);
    });
    cartItems.addEventListener("click", event => {
      const button = event.target.closest("[data-remove]");
      if (!button) return;
      delete cart[button.dataset.remove];
      renderCart();
    });
    
    document.getElementById("place-order").addEventListener("click", () => {
      const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
      if (!entries.length) {
        showMessage("order-message", "Add a product to your cart before placing an order.", true);
        return;
      }
      if (!form.reportValidity()) return;

      const name = form.elements.name.value.trim();
      const phone = form.elements.phone.value.trim();
      if (!name || !/^[0-9+\-\s]{10,16}$/.test(phone)) {
        showMessage("order-message", "Please enter a name and a valid 10-digit mobile number.", true);
        return;
      }

      const method = form.elements.method.value || "Drop-off";
      const location = String(form.elements.location?.value || "").trim();
      if (!location) {
        showMessage("order-message", "Please enter or choose a delivery or collection location.", true);
        return;
      }
      const subtotal = entries.reduce((sum, [key, qty]) => sum + products[key].price * qty, 0);
      const deliveryFee = method === "Pickup" ? DELIVERY_FEE : 0;

      const purchase = {
        id: "ORD-" + Math.random().toString(36).slice(2, 7).toUpperCase(),
        farmerName: name,
        phone,
        items: entries.map(([key, qty]) => ({
          name: products[key].name,
          quantity: qty,
          unit: products[key].unit,
          price: products[key].price
        })),
        subtotal,
        deliveryFee,
        totalAmount: subtotal + deliveryFee,
        notes: form.elements.details.value.trim(),
        method,
        location,
        status: "Demonstration order",
        createdAt: new Date().toISOString(),
        demo: true
      };

      try {
        const orders = readList(ORDER_KEY);
        orders.unshift(purchase);
        writeList(ORDER_KEY, orders);

        Object.keys(cart).forEach(key => delete cart[key]);
        renderCart();
        form.reset();
        syncLocationFields();
        renderCart();
        document.getElementById("lookup-ORD-id").value = purchase.id;
        showMessage("order-message", `Demonstration order ${purchase.id} created. No payment has been taken.`);
        renderFarmerOrder(purchase);
      } catch (error) {
        showMessage("order-message", "Could not save this demonstration order in browser storage.", true);
      }
    });

    function renderFarmerOrder(order) {
      const result = document.getElementById("ticket-ORD-result");
      if (!result) return;
      result.innerHTML = `
        <div class="ticket-card">
          <div class="ticket-id">${escapeHTML(order.id)}</div>
          <h3>${escapeHTML(order.farmerName)}</h3>
          <span class="status accepted">${escapeHTML(order.status)}</span>
          <div class="ticket-meta">
            <div><span>Mobile</span><b>${escapeHTML(order.phone)}</b></div>
            <div><span>Subtotal</span><b>${money(order.subtotal ?? order.totalAmount)}</b></div>
            <div><span>Delivery fee</span><b>${money(order.deliveryFee ?? 0)}</b></div>
            <div><span>Total</span><b>${money(order.totalAmount)}</b></div>
            <div><span>Fulfillment</span><b>${order.method === "Pickup" ? "Home delivery" : "Collection point"}</b></div>
            <div><span>Location</span><b>${escapeHTML(order.location)}</b></div>
            <div><span>Items</span><b>${escapeHTML(order.items.map(item => `${item.quantity} ${item.unit} ${item.name}`).join(", "))}</b></div>
            <div><span>Details</span><b>${escapeHTML(order.notes || "No additional details")}</b></div>
          </div>
          <p class="fine-print">This is a local demonstration record. No real order or payment was processed.</p>
        </div>`;
    }

    document.getElementById("lookup-ORD-form").addEventListener("submit", event => {
      event.preventDefault();
      const id = document.getElementById("lookup-ORD-id").value.trim().toUpperCase();
      const order = readList(ORDER_KEY).find(item => item.id.toUpperCase() === id);
      if (!order) {
        document.getElementById("ticket-ORD-result").innerHTML =
          '<p class="form-message error">No demonstration order found. Check the ticket ID and try again.</p>';
        return;
      }
      renderFarmerOrder(order);
    });

    syncLocationFields();
    renderCart();
  }

  const page = document.body.dataset.page;
  if (page === "customer") initCustomer();
  if (page === "admin") initAdmin();
  if (page === "farmer") initFarmer();
})();
