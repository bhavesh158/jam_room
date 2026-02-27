// JamRoom Web Client
(function() {
    let socket = null;
    let currentPoll = null;
    let selectedOption = null;
    let hasVoted = false;
    let serverAddress = '';
    let clientCount = 1;

    // Auto-detect server address
    function detectServerAddress() {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = window.location.port || (protocol === 'https:' ? '443' : '80');
        serverAddress = `${hostname}${port !== '80' && port !== '443' ? ':' + port : ''}`;
        return serverAddress;
    }

    // Initialize Socket.IO connection
    function initSocket() {
        socket = io();

        socket.on('connect', () => {
            console.log('Connected to server');
            renderContent();
        });

        socket.on('poll:update', (data) => {
            currentPoll = data.poll;
            renderContent();
        });

        socket.on('clients:update', (data) => {
            clientCount = data.count;
            updateClientCount();
        });

        socket.on('error', (data) => {
            alert(data.message);
        });
    }

    // Render content based on current state
    function renderContent() {
        const main = document.getElementById('mainContent');
        const bottomNav = document.getElementById('bottomNav');
        const backBtn = document.getElementById('backBtn');

        if (!currentPoll) {
            // Show create poll screen
            backBtn.classList.add('hidden');
            bottomNav.classList.add('hidden');
            renderCreatePoll(main);
        } else {
            // Show poll interface
            backBtn.classList.remove('hidden');
            bottomNav.classList.remove('hidden');
            renderPollInterface(main);
        }
    }

    // Render create poll screen
    function renderCreatePoll(container) {
        container.innerHTML = `
            <div class="text-center mb-8 fade-in">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                    <span class="material-symbols-outlined text-lg">lan</span>
                    <span class="text-sm font-medium">Connected to ${serverAddress || detectServerAddress()}</span>
                </div>
                <h2 class="text-3xl font-bold leading-tight dark:text-white mb-3">Create a Poll</h2>
                <p class="text-slate-500 dark:text-slate-400">Set up a quick poll for your team to vote on</p>
            </div>

            <div class="space-y-5 fade-in">
                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Poll Question
                    </label>
                    <input 
                        type="text" 
                        id="pollQuestion" 
                        placeholder="e.g., What should we order for lunch?"
                        class="w-full px-4 py-3 rounded-xl border-2 border-primary/10 bg-white dark:bg-slate-900 focus:border-primary focus:outline-none transition-colors"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Options (2-6)
                    </label>
                    <div id="optionsContainer" class="space-y-3">
                        <div class="flex gap-2">
                            <input type="text" class="option-input flex-1 px-4 py-3 rounded-xl border-2 border-primary/10 bg-white dark:bg-slate-900 focus:border-primary focus:outline-none transition-colors" placeholder="Option 1" />
                            <button class="remove-option p-3 text-slate-400 hover:text-red-500 transition-colors" disabled>
                                <span class="material-symbols-outlined">remove_circle</span>
                            </button>
                        </div>
                        <div class="flex gap-2">
                            <input type="text" class="option-input flex-1 px-4 py-3 rounded-xl border-2 border-primary/10 bg-white dark:bg-slate-900 focus:border-primary focus:outline-none transition-colors" placeholder="Option 2" />
                            <button class="remove-option p-3 text-slate-400 hover:text-red-500 transition-colors">
                                <span class="material-symbols-outlined">remove_circle</span>
                            </button>
                        </div>
                    </div>
                    <button id="addOptionBtn" class="mt-3 text-sm text-primary font-medium flex items-center gap-1 hover:opacity-80 transition-opacity">
                        <span class="material-symbols-outlined text-sm">add_circle</span>
                        Add Option
                    </button>
                </div>

                <button id="startPollBtn" class="w-full py-4 px-6 bg-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-2 mt-8">
                    <span>Start Poll</span>
                    <span class="material-symbols-outlined">play_arrow</span>
                </button>
            </div>
        `;

        // Add event listeners
        let optionCount = 2;
        const addOptionBtn = document.getElementById('addOptionBtn');
        const optionsContainer = document.getElementById('optionsContainer');
        const startPollBtn = document.getElementById('startPollBtn');

        addOptionBtn.addEventListener('click', () => {
            if (optionCount >= 6) return;
            optionCount++;
            const div = document.createElement('div');
            div.className = 'flex gap-2 fade-in';
            div.innerHTML = `
                <input type="text" class="option-input flex-1 px-4 py-3 rounded-xl border-2 border-primary/10 bg-white dark:bg-slate-900 focus:border-primary focus:outline-none transition-colors" placeholder="Option ${optionCount}" />
                <button class="remove-option p-3 text-slate-400 hover:text-red-500 transition-colors">
                    <span class="material-symbols-outlined">remove_circle</span>
                </button>
            `;
            optionsContainer.appendChild(div);
            updateRemoveButtons();
        });

        function updateRemoveButtons() {
            const removeBtns = document.querySelectorAll('.remove-option');
            removeBtns.forEach((btn, index) => {
                btn.disabled = optionCount <= 2;
                btn.onclick = () => {
                    if (optionCount <= 2) return;
                    btn.parentElement.remove();
                    optionCount--;
                    updateRemoveButtons();
                };
            });
        }

        updateRemoveButtons();

        startPollBtn.addEventListener('click', () => {
            const question = document.getElementById('pollQuestion').value.trim();
            const optionInputs = document.querySelectorAll('.option-input');
            const options = Array.from(optionInputs)
                .map(input => input.value.trim())
                .filter(text => text.length > 0);

            if (!question) {
                alert('Please enter a poll question');
                return;
            }
            if (options.length < 2) {
                alert('Please enter at least 2 options');
                return;
            }

            socket.emit('poll:create', { question, options });
        });
    }

    // Render poll interface
    function renderPollInterface(container) {
        const totalVotes = currentPoll.options.reduce((sum, opt) => sum + opt.votes, 0);
        
        container.innerHTML = `
            <div class="mb-8 text-center fade-in">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
                    <span class="material-symbols-outlined text-sm">lan</span>
                    <span class="text-xs font-medium">Connected to ${serverAddress || detectServerAddress()}</span>
                </div>
                <h2 class="text-2xl font-bold leading-tight dark:text-white">${escapeHtml(currentPoll.question)}</h2>
                <p class="mt-2 text-slate-500 dark:text-slate-400 text-sm">
                    ${currentPoll.isActive ? 'Select one option to cast your vote' : 'Poll closed by host'}
                </p>
            </div>

            <div class="space-y-4 flex-1 fade-in">
                ${currentPoll.options.map(option => {
                    const userVoted = hasVoted && selectedOption === option.id;
                    const isLeading = currentPoll.isActive && option.votes === Math.max(...currentPoll.options.map(o => o.votes)) && option.votes > 0;
                    
                    return `
                        <label class="relative block cursor-pointer group fade-in">
                            <input 
                                type="radio" 
                                name="poll-option" 
                                value="${option.id}"
                                ${userVoted ? 'checked' : ''}
                                ${!currentPoll.isActive ? 'disabled' : ''}
                                class="sr-only radio-custom"
                            />
                            <div class="flex items-center justify-between p-5 rounded-xl border-2 ${userVoted ? 'border-primary bg-primary/5' : 'border-primary/10 bg-white dark:bg-slate-900'} transition-all hover:border-primary/30 active:scale-[0.98]">
                                <div class="flex items-center gap-4">
                                    <div class="option-icons">
                                        <span class="material-symbols-outlined">${getOptionIcon(option.text)}</span>
                                    </div>
                                    <span class="text-lg font-medium">${escapeHtml(option.text)}</span>
                                </div>
                                <div class="radio-dot size-6 rounded-full border-2 border-primary/20 flex items-center justify-center transition-colors"></div>
                            </div>
                        </label>
                    `;
                }).join('')}
            </div>

            ${currentPoll.isActive && !hasVoted ? `
                <div class="mt-10 mb-4 fade-in">
                    <button id="submitVoteBtn" class="w-full py-4 px-6 bg-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <span>Submit Vote</span>
                        <span class="material-symbols-outlined">send</span>
                    </button>
                    <p class="text-center text-xs text-slate-400 mt-4">You can change your mind until the host closes the poll.</p>
                </div>
            ` : hasVoted ? `
                <div class="mt-10 mb-4 fade-in">
                    <div class="w-full py-4 px-6 bg-emerald-500/10 text-emerald-600 font-bold text-lg rounded-xl flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined">check_circle</span>
                        <span>Vote Submitted!</span>
                    </div>
                </div>
            ` : ''}
        `;

        // Add event listeners for option selection
        const radioButtons = document.querySelectorAll('input[name="poll-option"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                selectedOption = parseInt(e.target.value);
            });
        });

        const submitBtn = document.getElementById('submitVoteBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                if (!selectedOption) {
                    alert('Please select an option');
                    return;
                }
                socket.emit('vote:submit', { optionId: selectedOption });
                hasVoted = true;
            });
        }
    }

    // Get icon based on option text
    function getOptionIcon(text) {
        const lower = text.toLowerCase();
        if (lower.includes('samosa')) return 'restaurant';
        if (lower.includes('kachori')) return 'bakery_dining';
        if (lower.includes('burger')) return 'lunch_dining';
        if (lower.includes('pizza')) return 'local_pizza';
        if (lower.includes('coffee') || lower.includes('tea')) return 'local_cafe';
        if (lower.includes('salad')) return 'set_meal';
        if (lower.includes('pasta')) return 'ramen_dining';
        if (lower.includes('taco') || lower.includes('mexican')) return 'taco';
        return 'restaurant';
    }

    // Update client count display
    function updateClientCount() {
        // Could add a small indicator somewhere
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Navigation handling
    function setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                
                navItems.forEach(n => n.classList.remove('active'));
                navItems.forEach(n => n.classList.add('text-slate-400'));
                item.classList.remove('text-slate-400');
                item.classList.add('active');

                if (view === 'vote') {
                    renderContent();
                } else if (view === 'results') {
                    renderResults();
                } else if (view === 'peers') {
                    renderPeers();
                } else if (view === 'config') {
                    renderConfig();
                }
            });
        });
    }

    // Render results view
    function renderResults() {
        const container = document.getElementById('mainContent');
        if (!currentPoll) {
            container.innerHTML = `
                <div class="text-center py-12 fade-in">
                    <span class="material-symbols-outlined text-6xl text-slate-400 mb-4">poll</span>
                    <h3 class="text-xl font-bold text-slate-600 dark:text-slate-400">No Active Poll</h3>
                    <p class="text-slate-500 dark:text-slate-500 mt-2">Create a poll to see results</p>
                </div>
            `;
            return;
        }

        const totalVotes = currentPoll.options.reduce((sum, opt) => sum + opt.votes, 0);
        const maxVotes = Math.max(...currentPoll.options.map(o => o.votes), 1);

        container.innerHTML = `
            <div class="mb-8 text-center fade-in">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
                    <span class="material-symbols-outlined text-sm">analytics</span>
                    <span class="text-xs font-medium">${totalVotes} vote${totalVotes !== 1 ? 's' : ''} cast</span>
                </div>
                <h2 class="text-2xl font-bold leading-tight dark:text-white">${escapeHtml(currentPoll.question)}</h2>
                <p class="mt-2 text-slate-500 dark:text-slate-400 text-sm">Live Results</p>
            </div>

            <div class="space-y-6 fade-in">
                ${currentPoll.options.map(option => {
                    const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                    const barWidth = totalVotes > 0 ? (option.votes / maxVotes) * 100 : 0;
                    const isLeading = option.votes === maxVotes && option.votes > 0;

                    return `
                        <div class="fade-in">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-sm font-medium">${escapeHtml(option.text)}</span>
                                <span class="text-sm font-bold ${isLeading ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}">
                                    ${option.votes} vote${option.votes !== 1 ? 's' : ''} (${percentage}%)
                                </span>
                            </div>
                            <div class="h-3 bg-primary/10 rounded-full overflow-hidden">
                                <div 
                                    class="h-full ${isLeading ? 'bg-primary' : 'bg-primary/60'} rounded-full transition-all duration-500"
                                    style="width: ${barWidth}%"
                                ></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            ${currentPoll.isActive ? `
                <div class="mt-8 text-center fade-in">
                    <p class="text-xs text-slate-400">Results update in real-time</p>
                </div>
            ` : `
                <div class="mt-8 text-center fade-in">
                    <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-500/10 text-slate-500 text-sm">
                        <span class="material-symbols-outlined text-sm">lock</span>
                        Poll Closed
                    </span>
                </div>
            `}
        `;
    }

    // Render peers view
    function renderPeers() {
        const container = document.getElementById('mainContent');
        container.innerHTML = `
            <div class="text-center mb-8 fade-in">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
                    <span class="material-symbols-outlined text-sm">group</span>
                    <span class="text-xs font-medium">${clientCount} connected</span>
                </div>
                <h2 class="text-2xl font-bold leading-tight dark:text-white">Connected Peers</h2>
                <p class="mt-2 text-slate-500 dark:text-slate-400 text-sm">Devices on this session</p>
            </div>

            <div class="space-y-3 fade-in">
                ${Array.from({ length: Math.max(clientCount, 1) }).map((_, i) => `
                    <div class="flex items-center gap-4 p-4 rounded-xl border border-primary/10 bg-white dark:bg-slate-900">
                        <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span class="material-symbols-outlined text-sm">device_unknown</span>
                        </div>
                        <div class="flex-1">
                            <p class="font-medium">Device ${i + 1}</p>
                            <p class="text-xs text-slate-500">Connected</p>
                        </div>
                        <span class="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Render config view
    function renderConfig() {
        const container = document.getElementById('mainContent');
        container.innerHTML = `
            <div class="text-center mb-8 fade-in">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
                    <span class="material-symbols-outlined text-sm">settings</span>
                    <span class="text-xs font-medium">Server Settings</span>
                </div>
                <h2 class="text-2xl font-bold leading-tight dark:text-white">Configuration</h2>
                <p class="mt-2 text-slate-500 dark:text-slate-400 text-sm">Manage the current session</p>
            </div>

            <div class="space-y-4 fade-in">
                <div class="p-4 rounded-xl border border-primary/10 bg-white dark:bg-slate-900">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="material-symbols-outlined text-primary">lan</span>
                        <span class="font-medium">Server Address</span>
                    </div>
                    <p class="text-sm text-slate-500 ml-10">${serverAddress || detectServerAddress()}</p>
                </div>

                ${currentPoll ? `
                    <div class="p-4 rounded-xl border border-primary/10 bg-white dark:bg-slate-900">
                        <div class="flex items-center gap-3 mb-3">
                            <span class="material-symbols-outlined text-primary">poll</span>
                            <span class="font-medium">Current Poll</span>
                        </div>
                        <p class="text-sm text-slate-500 ml-10 mb-3">${escapeHtml(currentPoll.question)}</p>
                        <div class="flex gap-2 ml-10">
                            ${currentPoll.isActive ? `
                                <button id="endPollBtn" class="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors">
                                    End Poll
                                </button>
                            ` : `
                                <button id="startPollBtn" class="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors">
                                    Start Poll
                                </button>
                            `}
                            <button id="resetPollBtn" class="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors">
                                Reset
                            </button>
                        </div>
                    </div>
                ` : ''}

                <div class="p-4 rounded-xl border border-primary/10 bg-white dark:bg-slate-900">
                    <div class="flex items-center gap-3 mb-3">
                        <span class="material-symbols-outlined text-primary">info</span>
                        <span class="font-medium">About JamRoom</span>
                    </div>
                    <p class="text-sm text-slate-500 ml-10">
                        Version 1.0.0<br>
                        Local real-time voting platform
                    </p>
                </div>
            </div>
        `;

        // Add event listeners
        const endPollBtn = document.getElementById('endPollBtn');
        const startPollBtn = document.getElementById('startPollBtn');
        const resetPollBtn = document.getElementById('resetPollBtn');

        if (endPollBtn) {
            endPollBtn.addEventListener('click', () => {
                socket.emit('poll:end');
            });
        }

        if (startPollBtn) {
            startPollBtn.addEventListener('click', () => {
                socket.emit('poll:start');
            });
        }

        if (resetPollBtn) {
            resetPollBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset the poll? This cannot be undone.')) {
                    socket.emit('poll:reset');
                }
            });
        }
    }

    // Back button handler
    function setupBackButton() {
        const backBtn = document.getElementById('backBtn');
        backBtn.addEventListener('click', () => {
            // Navigate to vote view
            document.querySelectorAll('.nav-item').forEach(n => {
                n.classList.remove('active');
                n.classList.add('text-slate-400');
            });
            const voteNav = document.querySelector('[data-view="vote"]');
            voteNav.classList.add('active');
            voteNav.classList.remove('text-slate-400');
            renderContent();
        });
    }

    // Initialize app
    function init() {
        detectServerAddress();
        initSocket();
        setupNavigation();
        setupBackButton();
    }

    // Start the app
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
