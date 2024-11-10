// src/utils/api.js
const API_BASE_URL = "http://localhost:3001/v1";

/**
 * Utility function to get the Authorization headers with the access token.
 * This function retrieves the stored access token from localStorage and
 * returns it in the appropriate format for use in authenticated API requests.
 *
 * @returns {Object} The headers containing the Authorization token and Content-Type.
 */
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  "Content-Type": "application/json",
});

/**
 * Function to log the user in by sending a POST request with the user's email and password.
 * If the login is successful, the access token and refresh token are stored in localStorage.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Object} The response data containing the tokens.
 * @throws {Error} If the login fails.
 */
export const login = async (email, password) => {
  try {
    // Send a POST request to the login endpoint with email and password
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // Check if the response is OK, otherwise throw an error
    if (!response.ok) {
      throw new Error("Login failed. Please check your credentials.");
    }

    // Parse and store the tokens in localStorage
    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; // Rethrow the error for handling upstream
  }
};

/**
 * Function to log the user out by sending a POST request to the logout endpoint.
 * It also removes the access token and refresh token from localStorage.
 *
 * @returns {Object} A message confirming successful logout.
 * @throws {Error} If logout fails.
 */
export const logout = async () => {
  try {
    // Send a POST request to the logout endpoint with the Authorization header
    await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    // Remove the tokens from localStorage after logging out
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    return { message: "Successfully logged out" };
  } catch (error) {
    console.error("Error logging out:", error);
    throw error; // Rethrow the error for handling upstream
  }
};

/**
 * Function to refresh the access token using the stored refresh token.
 * A POST request is made to the refresh endpoint with the refresh token,
 * and if successful, the new access token is saved to localStorage.
 *
 * @returns {string} The new access token.
 * @throws {Error} If token refresh fails.
 */
export const refreshAccessToken = async () => {
  try {
    // Send a POST request to the refresh endpoint with the refresh token
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: localStorage.getItem("refreshToken"),
      }),
    });

    // Check if the response is OK, otherwise throw an error
    if (!response.ok) {
      throw new Error("Token refresh failed. Please log in again.");
    }

    // Parse and store the new access token and optional refresh token
    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    return data.accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error; // Rethrow the error for handling upstream
  }
};

/**
 * Function to send the generated part file data to the backend.
 *
 * @param {ArrayBuffer} partFileData - The binary data of the generated part file.
 * @param {string} filename - The name of the part file.
 * @throws {Error} If the upload fails.
 */
export const sendPartFileToBackend = async (partFileData, filename) => {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    const blob = new Blob([partFileData], { type: "application/octet-stream" });
    formData.append("file", blob, filename);

    // Send a POST request to the backend endpoint
    const response = await fetch(`${API_BASE_URL}/uploadPartFile`, {
      method: "POST",
      // headers: getAuthHeaders(), // Include if authentication is required
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload part file.");
    }

    const data = await response.json();
    console.log("Part file uploaded successfully:", data);

    // Provide user feedback if necessary
  } catch (error) {
    console.error("Error uploading part file:", error);
    throw error; // Rethrow the error for handling upstream
  }
};
