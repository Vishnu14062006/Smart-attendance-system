// Function to handle login
function login() {
    // Just a simple student login logic
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user !== "" && pass !== "") {
        // Go to dashboard if user entered something
        window.location.href = "dashboard.html";
    } else {
        alert("Please enter username and password!");
    }
}

// Function to mark attendance
function markAttendance() {
    // Check if input is not empty
    let scanData = document.getElementById("scanInput").value;
    if (scanData === "") {
        alert("Please enter ID to scan!");
        return;
    }

    // Show success message
    document.getElementById("message").innerHTML = "Attendance Marked Successfully!";
    document.getElementById("message").style.color = "green";

    // Optional alert like a simple project
    alert("Attendance Marked Successfully!");
}
