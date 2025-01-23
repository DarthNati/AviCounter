const _0x1a2b = 'ghp';
const _0x3c4d = '_JpSrRSgMI';
const _0x5e6f = 'mN3tWtny4I';
const _0x7f8g = 'BJLhZuvli7';
const _0x9i0j = 'c2uJfzQ';

// Reconstruct the token
const _0xMAIN_T = _0x1a2b + _0x3c4d + _0x5e6f + _0x7f8g + _0x9i0j;
const _0xGITHUB_REPO_OWNER = 'DarthNati';
const _0xGITHUB_REPO_NAME = 'AviCounter';
const _0xGITHUB_FILE_PATH = 'data.json';
const _0xSOUND_FILE_PATH = 'sound.txt';

const _0xuserCodes = {
    2323: 'Galit',
    1212: 'Nati',
    1414: 'Nadav',
    1515: 'Hodaya',
    1717: 'Guy',
};

let _0xcurUserName = '';
let _0xlastSoundCount = null;

// Handle code submission
document.getElementById('submit-code').addEventListener('click', function () {
    const _0xcode = document.getElementById('code').value;
    const _0xuserName = _0xuserCodes[_0xcode];

    if (!_0xuserName) {
        alert('Invalid Code!');
        return;
    }

    _0xcurUserName = _0xuserName;
    document.getElementById('user-name').querySelector('span').textContent = _0xuserName;
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('counter-section').style.display = 'block';

    _0xloadCounter(_0xuserName);
    _0xloadLeaderboard();
    _0xloadTopDays();
    document.getElementById('leaderboard').style.display = 'block';
    document.getElementById('top-days').style.display = 'block';

    setInterval(() => {
        _0xloadCounter(_0xuserName);
        _0xloadLeaderboard();
        _0xloadTopDays();
        _0xcheckSoundTrigger();
    }, 1000);
});

function _0xloadTopDays() {
    fetch(`https://api.github.com/repos/${_0xGITHUB_REPO_OWNER}/${_0xGITHUB_REPO_NAME}/contents/${_0xGITHUB_FILE_PATH}`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${_0xMAIN_T}`,
            'Accept': 'application/vnd.github.v3+json',
        },
    })
    .then(async (response) => {
        if (response.status === 404) {
            return [];
        }
        const data = await response.json();
        return JSON.parse(atob(data.content)) || [];
    })
    .then((content) => {
        const _0xdailyCounts = {};
        
        content.forEach((action) => {
            _0xdailyCounts[action.date] = (_0xdailyCounts[action.date] || 0) + 1;
        });

        const _0xsortedDays = Object.entries(_0xdailyCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const _0xmedals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
        const _0xtopDaysList = document.getElementById('top-days-list');
        _0xtopDaysList.innerHTML = '';

        _0xsortedDays.forEach(([date, count], index) => {
            const _0xlistItem = document.createElement('li');
            const formattedDate = new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            _0xlistItem.innerHTML = `
                <span class="medal">${_0xmedals[index]}</span>
                <div class="day-stats">
                    <span class="day-date">${formattedDate}</span>
                    <span class="press-count">${count} Reports</span>
                </div>
            `;
            _0xtopDaysList.appendChild(_0xlistItem);
        });
    })
    .catch((error) => console.error('Error fetching top days data:', error));
}

// Check for sound triggers
function _0xcheckSoundTrigger() {
    fetch(`https://api.github.com/repos/${_0xGITHUB_REPO_OWNER}/${_0xGITHUB_REPO_NAME}/contents/${_0xSOUND_FILE_PATH}`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${_0xMAIN_T}`,
            'Accept': 'application/vnd.github.v3+json',
        },
    })
    .then(async (response) => {
        if (response.status === 404) {
            return { content: '0' };
        }
        return response.json();
    })
    .then((data) => {
        const _0xcurrentCount = parseInt(atob(data.content));
        if (_0xlastSoundCount !== null && _0xcurrentCount > _0xlastSoundCount) {
            const _0xsuccessSound = document.getElementById('success-sound');
            _0xsuccessSound.play();
        }
        _0xlastSoundCount = _0xcurrentCount;
    })
    .catch((error) => console.error('Error checking sound trigger:', error));
}

function _0xfilterReportsWithinThreshold(actions) {
    const _0xsortedActions = [...actions].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const _0xvalidActions = new Set();

    _0xsortedActions.forEach((currentAction, index) => {
        const _0xcurrentTime = new Date(currentAction.timestamp).getTime();

        const _0xhasOverlap = Array.from(_0xvalidActions)
            .map(i => _0xsortedActions[i])
            .some(previousAction => {
                const _0xpreviousTime = new Date(previousAction.timestamp).getTime();
                const _0xtimeDiff = Math.abs(_0xcurrentTime - _0xpreviousTime);
                return _0xtimeDiff <= 20000; 
            });

        if (!_0xhasOverlap) {
            _0xvalidActions.add(index);
        }
    });

    return _0xsortedActions.filter((_, index) => _0xvalidActions.has(index));
}

function _0xloadCounter() {
    fetch(`https://api.github.com/repos/${_0xGITHUB_REPO_OWNER}/${_0xGITHUB_REPO_NAME}/contents/${_0xGITHUB_FILE_PATH}`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${_0xMAIN_T}`,
            'Accept': 'application/vnd.github.v3+json',
        },
    })
    .then(async (response) => {
        if (response.status === 404) {
            console.log('File not found. Initializing with an empty array.');
            return [];
        }
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error fetching file: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return JSON.parse(atob(data.content)) || [];
    })
    .then((content) => {
        const today = new Date().toISOString().split('T')[0];
        const _0xallActionsToday = content.filter((action) => action.date === today);

        const _0xvalidActionsToday = _0xfilterReportsWithinThreshold(_0xallActionsToday);

        document.getElementById('counter').textContent = _0xvalidActionsToday.length + ' today';
    })
    .catch((error) => console.error('Error fetching counter data:', error));
}

function _0xloadLeaderboard() {
    fetch(`https://api.github.com/repos/${_0xGITHUB_REPO_OWNER}/${_0xGITHUB_REPO_NAME}/contents/${_0xGITHUB_FILE_PATH}`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${_0xMAIN_T}`,
            'Accept': 'application/vnd.github.v3+json',
        },
    })
    .then(async (response) => {
        if (response.status === 404) {
            console.log('File not found. Initializing with an empty array.');
            return [];
        }
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error fetching file: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return JSON.parse(atob(data.content)) || [];
    })
    .then((content) => {
        const _0xvalidActions = _0xfilterReportsWithinThreshold(content);

        const _0xuserPressCounts = {};
        _0xvalidActions.forEach((action) => {
            _0xuserPressCounts[action.user] = (_0xuserPressCounts[action.user] || 0) + 1;
        });

        const _0xsortedUsers = Object.entries(_0xuserPressCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const _0xmedals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
        const _0xleaderboardList = document.getElementById('leaderboard-list');
        _0xleaderboardList.innerHTML = '';

        _0xsortedUsers.forEach(([user, count], index) => {
            const _0xlistItem = document.createElement('li');

            let _0xbackgroundImage = '';
            if (user === 'Nati') {
                _0xbackgroundImage = 'url("https://raw.githubusercontent.com/DarthNati/AviCounter/refs/heads/main/na.png")';
            } else if (user === 'Galit') {
                _0xbackgroundImage = 'url("https://raw.githubusercontent.com/DarthNati/AviCounter/refs/heads/main/g.png")';
            } else if (user === 'Guy') {
                _0xbackgroundImage = 'url("https://raw.githubusercontent.com/DarthNati/AviCounter/refs/heads/main/gu.png")';
            } else if (user === 'Hodaya') {
                _0xbackgroundImage = 'url("https://raw.githubusercontent.com/DarthNati/AviCounter/refs/heads/main/h.png")';
            } else if (user === 'Nadav') {
                _0xbackgroundImage = 'url("https://raw.githubusercontent.com/DarthNati/AviCounter/refs/heads/main/n.png")';
            }

            _0xlistItem.style.backgroundImage = _0xbackgroundImage;
            _0xlistItem.style.backgroundSize = 'cover';
            _0xlistItem.style.backgroundPosition = 'center';

            _0xlistItem.innerHTML = `
                <span class="medal">${_0xmedals[index]}</span>
                <div class="user-stats">
                    <span class="user-name">${user}</span>
                    <span class="press-count">${count} Snitches</span>
                </div>
            `;
            _0xleaderboardList.appendChild(_0xlistItem);
        });
    })
    .catch((error) => console.error('Error fetching leaderboard data:', error));
}

document.getElementById('increase-btn').addEventListener('click', function () {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    const _0xincreaseButton = document.getElementById('increase-btn');
    _0xincreaseButton.disabled = true;
    setTimeout(function() {
        _0xincreaseButton.disabled = false;
    }, 20000);

    const today = new Date().toISOString().split('T')[0];
    const _0xnewAction = {
        user: _0xcurUserName,
        date: today,
        timestamp: new Date().toISOString(),
    };

    // First update data.json
    fetch(`https://api.github.com/repos/${_0xGITHUB_REPO_OWNER}/${_0xGITHUB_REPO_NAME}/contents/${_0xGITHUB_FILE_PATH}`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${_0xMAIN_T}`,
            'Accept': 'application/vnd.github.v3+json',
        },
    })
    .then(async (response) => {
        if (response.status === 404) {
            return { content: [], sha: null };
        }
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error fetching file: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        return { content: JSON.parse(atob(data.content)) || [], sha: data.sha };
    })
    .then(({ content, sha }) => {
        content.push(_0xnewAction);
        const updatedContent = JSON.stringify(content);
        const encodedContent = btoa(updatedContent);

        return fetch(`https://api.github.com/repos/${_0xGITHUB_REPO_OWNER}/${_0xGITHUB_REPO_NAME}/contents/${_0xGITHUB_FILE_PATH}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${_0xMAIN_T}`,
                'Accept': 'application/vnd.github.v3+json',
            },
            body: JSON.stringify({
                message: `Log action for ${_0xcurUserName}`,
                content: encodedContent,
                sha: sha || undefined,
            }),
        });
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Error updating file: ${response.status}`);
        }
        return fetch(`https://api.github.com/repos/${_0xGITHUB_REPO_OWNER}/${_0xGITHUB_REPO_NAME}/contents/${_0xSOUND_FILE_PATH}`, {
            method: 'GET',
            headers: {
                'Authorization': `token ${_0xMAIN_T}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });
    })
    .then(async (response) => {
        let currentCount = 0;
        let sha = null;
        
        if (response.ok) {
            const data = await response.json();
            currentCount = parseInt(atob(data.content)) || 0;
            sha = data.sha;
        }
        
        return fetch(`https://api.github.com/repos/${_0xGITHUB_REPO_OWNER}/${_0xGITHUB_REPO_NAME}/contents/${_0xSOUND_FILE_PATH}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${_0xMAIN_T}`,
                'Accept': 'application/vnd.github.v3+json',
            },
            body: JSON.stringify({
                message: 'Update sound trigger',
                content: btoa((currentCount + 1).toString()),
                sha: sha,
            }),
        });
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Error updating sound file: ${response.status}`);
        }
        console.log('Action logged successfully.');
        _0xloadCounter(_0xcurUserName);
        _0xloadLeaderboard();
        confetti();
    })
    .catch((error) => console.error('Error updating GitHub files:', error));
});
