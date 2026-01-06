// SOS Button Logic
const sosButton = document.querySelector(".sos-btn");

sosButton.addEventListener("click", () => {
  const confirmSOS = confirm(
    "Are you sure you want to trigger SOS?"
  );

  if (confirmSOS) {
    activateSOS();
  }
});

function activateSOS() {
  showStatus("🚨 SOS Activated. Sending alerts...");

  // Get Location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        sendAlert(lat, lon);
      },
      () => {
        showStatus("⚠️ Location access denied. Sending SOS without location.");
        sendAlert(null, null);
      }
    );
  } else {
    sendAlert(null, null);
  }
}

function sendAlert(lat, lon) {
  let message = "EMERGENCY! I may be in danger.";

  if (lat && lon) {
    message += ` Location: https://maps.google.com/?q=${lat},${lon}`;
  }

  // Simulated alerts
  console.log("📩 SMS Sent:", message);
  console.log("📞 Alert sent to trusted contacts");

  showStatus("✅ SOS alert sent to trusted contacts.");

  autoEscalation();
}

// Automatic escalation if no response
function autoEscalation() {
  setTimeout(() => {
    showStatus("🚨 No response detected. Escalating emergency!");
    console.log("🔊 Emergency alarm activated");
  }, 10000); // 10 seconds
}

// Show status on screen
function showStatus(text) {
  let statusBox = document.getElementById("status");

  if (!statusBox) {
    statusBox = document.createElement("div");
    statusBox.id = "status";
    statusBox.style.marginTop = "20px";
    statusBox.style.padding = "15px";
    statusBox.style.background = "#ffe6e6";
    statusBox.style.borderLeft = "5px solid red";
    document.querySelector(".container").appendChild(statusBox);
  }

  statusBox.innerText = text;
}
// Load contacts on page load
document.addEventListener("DOMContentLoaded", loadContacts);

function addContact() {
  const name = document.getElementById("contactName").value;
  const phone = document.getElementById("contactPhone").value;

  if (name === "" || phone === "") {
    alert("Please enter contact name and phone number");
    return;
  }

  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

  contacts.push({ name, phone });
  localStorage.setItem("contacts", JSON.stringify(contacts));

  document.getElementById("contactName").value = "";
  document.getElementById("contactPhone").value = "";

  loadContacts();
}

function loadContacts() {
  const contactList = document.getElementById("contactList");
  contactList.innerHTML = "";

  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

  contacts.forEach(contact => {
    const li = document.createElement("li");
    li.textContent = `${contact.name} - ${contact.phone}`;
    contactList.appendChild(li);
  });
}
