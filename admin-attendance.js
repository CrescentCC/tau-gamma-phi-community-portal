const attendanceEventSelect = document.getElementById("attendanceEventSelect");
const attendanceTableBody = document.getElementById("attendanceTableBody");
const attTotalMembers = document.getElementById("attTotalMembers");
const attPresent = document.getElementById("attPresent");
const attAbsent = document.getElementById("attAbsent");

function populateEventOptions() {
  const events = getEvents();

  events.forEach((event) => {
    const opt = document.createElement("option");
    opt.value = event.id;
    opt.textContent = event.title;
    attendanceEventSelect.appendChild(opt);
  });
}

function renderAttendance(eventId) {
  const members = getUsers().filter((u) => u.role === "member");
  const attendance = getAttendanceForEvent(eventId);

  attTotalMembers.textContent = members.length;

  if (members.length === 0) {
    attendanceTableBody.innerHTML =
      '<tr><td colspan="3" class="admin-table-empty">No registered members yet.</td></tr>';
    attPresent.textContent = 0;
    attAbsent.textContent = 0;
    return;
  }

  let presentCount = 0;

  attendanceTableBody.innerHTML = members
    .map((member) => {
      const record = attendance[member.username] || { status: "Absent", time: "" };
      if (record.status === "Present") presentCount++;

      return `
        <tr>
          <td class="attendance-name-cell">
            <span class="attendance-avatar"><i class="fa-solid fa-user"></i></span>
            ${escapeHtml(member.username)}
          </td>
          <td>
            <select class="admin-input status-select" data-username="${escapeHtml(member.username)}">
              <option value="Present" ${record.status === "Present" ? "selected" : ""}>Present</option>
              <option value="Absent" ${record.status === "Absent" ? "selected" : ""}>Absent</option>
            </select>
          </td>
          <td class="attendance-time-cell">${record.time || "-"}</td>
        </tr>
      `;
    })
    .join("");

  attPresent.textContent = presentCount;
  attAbsent.textContent = members.length - presentCount;

  attendanceTableBody.querySelectorAll(".status-select").forEach((select) => {
    select.addEventListener("change", () => {
      setAttendanceStatus(eventId, select.dataset.username, select.value);
      renderAttendance(eventId);
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

attendanceEventSelect.addEventListener("change", () => {
  renderAttendance(attendanceEventSelect.value);
});

populateEventOptions();
