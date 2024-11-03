// src/components/HelpPage.jsx
import React from 'react';

const HelpPage = () => {
    return (
        <div className="container mt-4">
            <h1>Help and User Guide</h1>
            <p>Welcome to the Part File Editor! This page provides information on the app's features, how to use them, and some helpful tips.</p>

            <section className="mt-4">
                <h2>Overview</h2>
                <p>
                    The Part File Editor allows users to create, edit, and manage part files for mapping coordinates with specific target rates.
                    The app includes functionalities for adding blocks with coordinates, setting target rates, visualizing on a map, and exporting
                    or importing block data for future use.
                </p>
            </section>

            <section className="mt-4">
                <h2>Features</h2>

                <h3>1. Adding Blocks</h3>
                <p>
                    You can add blocks either by clicking on the map or by manually entering coordinates in the form. Each block can have its own
                    target rate and is displayed on the map for easy visualization.
                </p>

                <h3>2. Map Display</h3>
                <p>
                    The map displays all the blocks you’ve created. Click on any block marker to view its details or to edit it. You can set
                    a default center location and zoom level using the Default Location Picker.
                </p>

                <h3>3. Block Manager</h3>
                <p>
                    The Block Manager shows a list of all blocks, with options to select, edit, or delete each block. The blocks are sorted based
                    on the criteria you select, making it easy to manage even large lists of blocks.
                </p>

                <h3>4. Default Location Picker</h3>
                <p>
                    Set a default latitude, longitude, and zoom level for the map. This is helpful for centering the map on a specific region
                    that you work with frequently.
                </p>

                <h3>5. Download and Upload Block List</h3>
                <p>
                    You can download all your blocks as a JSON file and re-upload it later. This makes it easy to save your work or transfer
                    blocks between devices.
                </p>

                <h3>6. Clear All Blocks</h3>
                <p>
                    Use the "Clear All Blocks" button to reset the app and remove all blocks. A confirmation prompt prevents accidental deletion.
                </p>

                <h3>7. Block Count Display</h3>
                <p>
                    The Block Count display shows the total number of blocks you’ve created, helping you keep track of block quantity.
                </p>
            </section>

            <section className="mt-4">
                <h2>How to Use the App</h2>

                <h3>Adding a Block</h3>
                <ol>
                    <li>To add a block, either click on the map at the desired location or enter the coordinates and target rate in the form.</li>
                    <li>After adding, the block will appear both in the map display and in the Block Manager list.</li>
                </ol>

                <h3>Editing a Block</h3>
                <ol>
                    <li>Select a block by clicking on it in the Block Manager or on its marker in the map display.</li>
                    <li>Edit the coordinates or target rate in the form and click "Update Block."</li>
                    <li>The block's details will be updated in both the map and Block Manager.</li>
                </ol>

                <h3>Deleting a Block</h3>
                <ol>
                    <li>In the Block Manager, click "Delete" next to the block you wish to remove.</li>
                    <li>Confirm the deletion in the prompt that appears.</li>
                </ol>

                <h3>Setting the Default Location</h3>
                <ol>
                    <li>Enter your desired latitude, longitude, and zoom level in the Default Location Picker.</li>
                    <li>This will set the default center and zoom level for the map, applied when the app loads.</li>
                </ol>

                <h3>Saving and Loading Blocks</h3>
                <ol>
                    <li>To save blocks, click "Download Blocks." This downloads a JSON file with your current blocks.</li>
                    <li>To load blocks from a JSON file, click "Upload Blocks," select your file, and the blocks will be imported.</li>
                </ol>

                <h3>Clearing All Blocks</h3>
                <ol>
                    <li>Click "Clear All Blocks" to delete all blocks.</li>
                    <li>Confirm the action when prompted.</li>
                </ol>
            </section>

            <section className="mt-4">
                <h2>Tips and Troubleshooting</h2>

                <h3>1. Block Positioning</h3>
                <p>
                    If blocks do not appear in the expected locations, check that the coordinates entered are correct and within a valid range.
                </p>

                <h3>2. Uploading Blocks</h3>
                <p>
                    Only JSON files with the correct structure are supported for upload. Ensure your file is in JSON format and contains an array
                    of blocks.
                </p>

                <h3>3. Resetting the Default Location</h3>
                <p>
                    If you want to reset the map’s center and zoom, simply re-enter the default location details and refresh the map.
                </p>

                <h3>4. Troubleshooting Map Issues</h3>
                <p>
                    If the map does not load correctly, try refreshing the app or ensuring that your internet connection is stable.
                </p>
            </section>

            <section className="mt-4">
                <h2>Contact Support</h2>
                <p>If you need further assistance, please contact our support team at support@partfileeditor.com.</p>
            </section>
        </div>
    );
};

export default HelpPage;

