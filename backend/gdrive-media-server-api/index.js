const express = require("express");
const { google } = require("googleapis");
const config = require("./config.json"); // Import config file

const app = express();
const port = 3000;

// Load credentials from JSON file
const credentials = require("./service-account-credentials.json");
const scopes = ["https://www.googleapis.com/auth/drive.readonly"];

// Initialize the Drive API client with credentials
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes,
});
const drive = google.drive({ version: "v3", auth });

async function getFolderId(folderName, parentId = null) {
  try {
    const response = await drive.files.list({
      pageSize: 1,
      fields: "files(id, name)",
      q: `name = '<span class="math-inline">\{folderName\}' and mimeType \= 'application/vnd\.google\-apps\.folder' and '</span>{parentId}' in parents`,
    });
    const files = response.data.files;
    return files.length ? files[0].id : null;
  } catch (error) {
    console.error("Error listing files:", error);
    return null;
  }
}

// List files in a folder by its ID
async function listFiles(folderId) {
  try {
    const response = await drive.files.list({
      pageSize: 100,
      fields: "files(id, name, mimeType)",
      q: `mimeType in 'image/*' or mimeType in 'video/*' or mimeType in 'audio/*' and '${folderId}' in parents`,
    });
    return response.data.files;
  } catch (error) {
    console.error("Error listing files:", error);
    return [];
  }
}

// Serve a media file
async function serveMedia(req, res) {
  const fileId = req.params.id;
  try {
    const response = await drive.files.get({
      fileId,
      fields: "downloadUrl",
    });
    const downloadUrl = response.data.downloadUrl;
    res.setHeader("Content-Disposition", `attachment; filename="${fileId}"`);
    res.redirect(downloadUrl);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).send("Error serving media file");
  }
}

(async () => {
  const rootFolderId = await getFolderId(config.root_folder);
  if (rootFolderId) {
    // Handle all requests dynamically
    app.get(`/${rootFolderId}/*`, async (req, res) => {
      const path = req.path.slice(rootFolderId.length + 1);
      const parts = path.split("/");
      const folder = parts[0]; // First part is the folder name
      const fileId = parts.length > 1 ? parts[1] : null; // Second part is the file ID (optional)

      if (fileId) {
        // Serve media file if ID is present
        serveMedia(req, res);
      } else if (folder) {
        // List files if a folder is specified
        const folderId = await getFolderId(folder, rootFolderId);
        if (folderId) {
          const files = await listFiles(folderId);
          res.json(files.map((file) => ({ title: file.name, id: file.id })));
        } else {
          res.status(404).send("Folder not found");
        }
      } else {
        // Handle root folder listing (optional)
        // ... (add logic for listing files in root folder if desired)
      }
    });
  } else {
    console.error("Root folder not found");
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();
