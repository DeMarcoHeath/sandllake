const express = require('express');
const { exec } = require('child_process');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 8000;

// Function to launch any Windows app
function launchApp(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error launching app: ${command} - ${error.message}`);
                reject(error);
            } else {
                console.log(`App launched: ${command}`);
                resolve(stdout || stderr);
            }
        });
    });
}

// Function to automate Edge using Puppeteer
async function automateEdge() {
    const browser = await puppeteer.launch({
        executablePath: 'C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Microsoft Edge.lnk', // Adjust for your Edge path
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.evaluate(() => {
        document.body.innerHTML = '<h1>Edge Automation Test</h1>';
    });
    await browser.close();
}

// Function to simulate resource stress in Chrome
async function stressChrome() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.evaluate(() => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        for (let i = 0; i < 10000; i++) {
            const innerDiv = document.createElement('div');
            div.appendChild(innerDiv);
        }
    });
    await browser.close();
}

// Function to execute multiple commands concurrently
async function executeConcurrentTasks(commands) {
    const tasks = commands.map((command) => launchApp(command));
    const browserTasks = [automateEdge(), stressChrome()];
    await Promise.all([...tasks, ...browserTasks]);
}

// API endpoint to trigger the tasks
app.get('/trigger', async (req, res) => {
    try {
        const commands = [
            'notepad', // Launch Notepad
            'calc', // Launch Calculator
            'mspaint', // Launch MS Paint
            'explorer', // Open File Explorer
            'start skype', // Launch Skype
            'wmplayer', // Launch Windows Media Player
        ];

        // Execute tasks concurrently
        await executeConcurrentTasks(commands);
        res.send({ status: 'Tasks executed successfully!' });
    } catch (error) {
        console.error('Error executing tasks:', error);
        res.status(500).send({ error: 'An error occurred while executing tasks.' });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
