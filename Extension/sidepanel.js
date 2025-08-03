// Theme management
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('research-assistant-theme') || 'light';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('research-assistant-theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? 'Light' : 'Dark';
    themeIcon.style.color = theme === 'dark' ? 'white' : 'black'; // ✅ Text color toggle
}


        // Load saved notes
        document.addEventListener('DOMContentLoaded', () => {
            chrome.storage.local.get(['researchNotes'], function(data) {
                if (data.researchNotes) {
                    document.getElementById('notes').value = data.researchNotes;
                }
            });

            document.getElementById('summarizeBtn').addEventListener('click', summarizeText);
            document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);
        });

        async function summarizeText() {
            const summarizeBtn = document.getElementById('summarizeBtn');
            const resultsDiv = document.getElementById('results');
            
            // Show loading state
            summarizeBtn.disabled = true;
            summarizeBtn.innerHTML = '<div class="spinner"></div>Processing...';
            
            showLoading();

            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                const [{ result }] = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: () => window.getSelection().toString()
                });

                // Check if any text was selected
                if (!result || result.trim() === '') {
                    showResult(' Please select some text on the page first to summarize.', 'error');
                    return;
                }

                const response = await fetch('http://localhost:8080/api/research/process', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: result, operation: 'summarize' })
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} - ${response.statusText}`);
                }

                const text = await response.text();
                showResult(text.replace(/\n/g, '<br>'), 'success');

            } catch (error) {
                console.error('Summarization error:', error);
                let errorMessage = 'An error occurred while processing your request.';
                
                if (error.message.includes('Failed to fetch')) {
                    errorMessage = '🔌 Unable to connect to the research service. Please make sure the API server is running on localhost:8080.';
                } else if (error.message.includes('API Error')) {
                    errorMessage = ` ${error.message}`;
                } else {
                    errorMessage = ` ${error.message}`;
                }
                
                showResult(errorMessage, 'error');
            } finally {
                // Reset button state
                summarizeBtn.disabled = false;
                summarizeBtn.innerHTML = '<span class="icon"></span>Summarize';
            }
        }

        async function saveNotes() {
            const saveBtn = document.getElementById('saveNotesBtn');
            const notes = document.getElementById('notes').value;
            
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<div class="spinner"></div>Saving...';

            try {
                await new Promise((resolve) => {
                    chrome.storage.local.set({ 'researchNotes': notes }, resolve);
                });
                
                showStatusMessage('Notes saved successfully! ', 'success');
            } catch (error) {
                showStatusMessage('Failed to save notes. Please try again.', 'error');
            } finally {
                setTimeout(() => {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = '<span class="icon"></span>Save Notes';
                }, 1000);
            }
        }

        function showLoading() {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    Analyzing selected text...
                </div>
            `;
        }

        function showResult(content, type = 'success') {
            const resultsDiv = document.getElementById('results');
            const icon = type === 'error' ? '' : '';
            
            resultsDiv.innerHTML = `
                <div class="result-item">
                    <div class="result-content">${content}</div>
                    <div class="status-indicator status-${type}">
                        ${icon} ${type === 'error' ? 'Error' : 'Summary Complete'}
                    </div>
                </div>
            `;
        }

        function showStatusMessage(message, type) {
            const existingStatus = document.querySelector('.temp-status');
            if (existingStatus) {
                existingStatus.remove();
            }

            const statusDiv = document.createElement('div');
            statusDiv.className = `status-indicator status-${type} temp-status`;
            statusDiv.textContent = message;
            statusDiv.style.position = 'fixed';
            statusDiv.style.top = '20px';
            statusDiv.style.right = '20px';
            statusDiv.style.zIndex = '1000';
            statusDiv.style.animation = 'slideIn 0.3s ease-out';

            document.body.appendChild(statusDiv);

            setTimeout(() => {
                statusDiv.remove();
            }, 3000);
        }