const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbxfpJDcAYsGlskgBY5JVx0iNTVDUCLJXsMX845fPSC73QC4eBH0AEPUNrqJu17BJJ7Z7A/exec"; // Ganti dengan URL Web App Apps Script kamu

async function loadData() {
  try {
    const res = await fetch(SHEET_API_URL);
    const data = await res.json();

    const tbody = document.querySelector("#invoice-table tbody");
    tbody.innerHTML = "";

    data.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.po}</td>
        <td>${row.type}</td>
        <td>${row.color}</td>
        <td>${row.size}</td>
        <td>${row.qty}</td>
        <td>${row.remain}</td>
        <td>${row.rework}</td>
        <td class="status-${row.status.toLowerCase()}">${row.status}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error(error);
    document.querySelector("#invoice-table tbody").innerHTML =
      `<tr><td colspan="8">Error loading data</td></tr>`;
  }
}

loadData();
