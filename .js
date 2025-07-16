const resultDiv = document.getElementById("result");
const select = document.getElementById("gameSelect");

async function fetchData() {
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('Gagal mengambil data');
    const data = await res.json();
    return data;
  } catch(e) {
    resultDiv.innerHTML = '<p style="color:#f44336">Gagal memuat data prediksi.</p>';
    return null;
  }
}

function getTodayString() {
  // Format YYYY-MM-DD
  const today = new Date();
  const tzOffset = today.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(today - tzOffset)).toISOString().slice(0,10);
  return localISOTime;
}

function render(data, game) {
  if (!data || !data[game]) {
    resultDiv.innerHTML = `<p>Data tidak tersedia untuk ${game}</p>`;
    return;
  }
  const item = data[game];
  let html = `<h3>Jam Hoki: ${item.jam}</h3>`;
  html += `<ul>` + item.pola.map(p => `<li>🎯 ${p}</li>`).join('') + `</ul>`;
  html += `<div class='tips'><strong>📌 Tips:</strong> ${item.tips}</div>`;
  resultDiv.innerHTML = html;
}

async function init() {
  const data = await fetchData();
  if (!data) return;
  const today = getTodayString();
  let dayData = data[today];
  if (!dayData) {
    // Jika tidak ada data hari ini, tampilkan data terakhir yg tersedia
    const days = Object.keys(data).sort().reverse();
    dayData = data[days[0]];
  }
  render(dayData, select.value);
  select.addEventListener("change", () => render(dayData, select.value));
}

init();