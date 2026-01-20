// Function to store user details locally when they log in
export const storeUserDetailsLocally = ({ userId, role, userName, ip }) => {
  localStorage.setItem("userDetails", JSON.stringify({ userId, role, userName, ip }));
};

// Function to log the event (console only for now, replacing Firestore)
export const logEvent = async ({ userId, role, userName, action, target, details, ip }) => {
  console.log("Event logged:", {
    userId,
    role,
    userName,
    action,
    target,
    details,
    ip,
    timestamp: new Date()
  });
};

// Function to handle logout
export const handleLogout = async () => {
  // Clear user details from localStorage
  localStorage.removeItem("userDetails");
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  console.log("User logged out successfully.");
};
