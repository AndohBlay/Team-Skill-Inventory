const API_URL = "http://127.0.0.1:8000/members";
const skillForm = document.getElementById("skillForm");
const memberList = document.getElementById("memberList");
const searchInput = document.getElementById("search");
const ctx = document.getElementById("skillChart").getContext("2d");

let members = [];
let skillData = {};

async function loadMembers() {
  try {
    const res = await fetch(API_URL);
    members = await res.json();
    renderMembers(members);
    updateSkillData();
    updateChart();
  } catch (err) {
    console.error("Error loading members:", err);
  }
}
async function addMemberToDB(member) {
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    });
    loadMembers(); 
  } catch (err) {
    console.error("Error adding member:", err);
  }
}


async function deleteMember(id) {
  if (!confirm("Are you sure you want to delete this member?")) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadMembers(); 
  } catch (err) {
    console.error("Error deleting member:", err);
  }
}


skillForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const skill = document.getElementById("skill").value.trim();
  const level = document.getElementById("level").value;

  if (!name || !skill || !level) return alert("Fill all fields!");

  await addMemberToDB({ name, skill, level });
  skillForm.reset();
});


searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = members.filter((m) => m.skill.toLowerCase().includes(query));
  renderMembers(filtered);
});


function renderMembers(list) {
  memberList.innerHTML = "";
  list.forEach((m) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${m.id}</td>
      <td>${m.name}</td>
      <td>${m.skill}</td>
      <td>${m.level}</td>
      <td><button onclick="deleteMember(${m.id})" class="delete-btn">❌ Delete</button></td>
    `;
    memberList.appendChild(row);
  });
}

function updateSkillData() {
  skillData = {};
  members.forEach(({ skill }) => {
    skillData[skill] = (skillData[skill] || 0) + 1;
  });
}


let skillChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Skill Distribution",
        data: [],
        backgroundColor: "#007bff",
        width: 10,
      },
    ],
  },
  options: {
    responsive: true,
    scales: { y: { beginAtZero: true } },
  },
});


function updateChart() {
  skillChart.data.labels = Object.keys(skillData);
  skillChart.data.datasets[0].data = Object.values(skillData);
  skillChart.update();
}


loadMembers();
