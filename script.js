// ================================
// Solar Panel Cleaning Request
// ================================

// Price calculation
const panelInput = document.getElementById("panels");
const totalPrice = document.getElementById("totalPrice");

function calculatePrice() {
  let panels = parseInt(panelInput.value);

  if (isNaN(panels) || panels <= 0) {
    totalPrice.innerHTML = "₹0";
    return;
  }

  let amount = 0;

  if (panels <= 10) {
    amount = 399;
  } else if (panels <= 20) {
    amount = 699;
  } else if (panels <= 40) {
    amount = 999;
  } else {
    amount = 999 + (panels - 40) * 20;
  }

  totalPrice.innerHTML = "₹" + amount;
}

panelInput.addEventListener("keyup", calculatePrice);
panelInput.addEventListener("change", calculatePrice);

// ================================
// Form Validation
// ================================

const form = document.getElementById("bookingForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.querySelector('input[type="text"]').value;
  const mobile = document.querySelector('input[type="tel"]').value;
  const panels = parseInt(panelInput.value);
  const amount = parseInt(totalPrice.innerText.replace("₹", ""));

  const success = await sendToServer({ name, mobile, panels, amount});

  if (success) {
    alert(
      "✅ Thank you!\n\nYour cleaning request has been submitted successfully.\nOur team will contact you shortly.",
    );
    form.reset();
    totalPrice.innerHTML = "₹399";
  } else {
    alert("❌ Something went wrong while saving your request. Please try again.");
  }
});

// ================================
// Future Integration Functions
// ================================

// Google Sheets
function sendToGoogleSheet() {
  // Add Google Apps Script URL here
}

// Firebase
function sendToFirebase() {
  // Firebase code here
}

// PHP/MySQL
async function sendToServer(data) {
  // Fetch API or AJAX code here
  try {
    const response = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const result = await response.json();
    console.log("Saved booking:", result);
    return true;
  } catch (err) {
    console.error("Error saving booking:", err);
    return false;
  }
}

// ================================
// WhatsApp Integration
// ================================

function openWhatsApp() {
  const name = document.querySelector('input[type="text"]').value;

  const mobile = document.querySelector('input[type="tel"]').value;

  const panels = panelInput.value;

  const message = `Solar Panel Cleaning Request

Name : ${name}

Mobile : ${mobile}

Panels : ${panels}

Estimated Charge : ${totalPrice.innerText}`;

  window.open("https://wa.me/919999999999?text=" + encodeURIComponent(message));
}
