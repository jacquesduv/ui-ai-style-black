// src/utils/fileUtils.js
export const downloadJSON = (data, filename = "data.json") => {
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
};

export const uploadJSON = (event, callback) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        callback(importedData);
      } catch (error) {
        alert("Error reading file. Ensure it is a valid JSON.");
      }
    };
    reader.readAsText(file);
  }
};
