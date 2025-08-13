document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("invoiceForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const brand = document.getElementById("brand").value;
    const invoice = document.getElementById("invoice").value.trim().toUpperCase();
    const resultDiv = document.getElementById("result");

    if (!brand || !invoice) {
      resultDiv.innerHTML = "⚠️ Masukin semua field-nya.";
      return;
    }

    resultDiv.innerHTML = "⏳ Loading...";

    const scriptURL = "https://script.google.com/macros/s/AKfycbwYP04Jd0s3ktqDuFO7TSfVz2ozr2ZgBEICZSYOIo7Ip1F7_iYT6WkR2B3djJ3aACLXeQ/exec";

    fetch(`${scriptURL}?brand=${encodeURIComponent(brand)}&invoice=${encodeURIComponent(invoice)}`)
      .then(res => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then(data => {
        if (!data || !data.found) {
          resultDiv.innerHTML = `❌ Invoice ${invoice} not found.`;
          return;
        }

        const exportDate = data.exportDate || "N/A";
        let totalQty = 0;

        const rows = data.results.map(item => {
          const po = item.po || "";
          const type = item.type || "";
          const color = item.color || "";
          const size = item.size || "";
          const qty = parseFloat(item.qty) || 0;
          const forThis = parseFloat(item.forThis) || 0;
          const remain = parseFloat(item.remain) || 0;
          const rework = parseFloat(item.rework) || 0;
          const status = item.status || "";

          totalQty += qty;

          return `
            <tr>
              <td>${po}</td>
              <td>${type}</td>
              <td>${color}</td>
              <td>${size}</td>
              <td>${qty}</td>
              <td>${forThis}</td>
              <td>${remain}</td>
              <td>${rework}</td>
              <td>${status}</td>
            </tr>
          `;
        }).join("");

        const table = `
          <h3>📦 Invoice: ${data.invoice} | Export Date: ${exportDate}</h3>
          <table>
            <thead>
              <tr>
                <th>PO</th>
                <th>TYPE</th>
                <th>COLOR</th>
                <th>SIZE</th>
                <th>QTY</th>
                <th>FOR THIS</th>
                <th>REMAIN</th>
                <th>REWORK</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <p style="margin-top: 10px;">📊 Total ${data.invoice}: ${totalQty} PCS</p>
        `;

        resultDiv.innerHTML = `
          <div style="
            border: 2px solid #e75480;
            background: #ffd6d6;
            padding: 15px;
            border-radius: 10px;
            overflow: auto;
          ">${table}</div>
        `;
      })
      .catch(err => {
        console.error("Fetch error:", err);
        resultDiv.innerHTML = `⚠️ Gagal fetch data.<br>${err.message}`;
      });
  });
});
