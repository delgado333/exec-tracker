let executives = JSON.parse(localStorage.getItem('executives')) || [];

window.addExecutive = function() {
    const name = document.getElementById('execName').value;
    const company = document.getElementById('company').value;
    const title = document.getElementById('title').value;
    const dateSent = document.getElementById('dateSent').value;

    if (!name || !company) {
        alert('Please enter at least a name and company');
        return;
    }

    const executive = {
        id: Date.now(),
        name,
        company,
        title,
        dateSent,
        status: 'Pending'
    };

    executives.push(executive);
    localStorage.setItem('executives', JSON.stringify(executives));
    loadExecutives();
    clearForm();
};

window.updateStatus = function(id, status) {
    executives = executives.map(exec => 
        exec.id === id ? {...exec, status} : exec
    );
    localStorage.setItem('executives', JSON.stringify(executives));
    loadExecutives();
};

window.deleteExecutive = function(id) {
    executives = executives.filter(exec => exec.id !== id);
    localStorage.setItem('executives', JSON.stringify(executives));
    loadExecutives();
};

function loadExecutives() {
    const container = document.getElementById('executiveList');
    const executivesHtml = executives.map(exec => `
        <div class="bg-white shadow-lg rounded-lg p-4 mb-4">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold">${exec.name}</h3>
                    <p class="text-gray-600">${exec.company}</p>
                    <p class="text-sm text-gray-500">${exec.title}</p>
                    ${exec.dateSent ? `<p class="text-sm text-gray-500">Sent: ${new Date(exec.dateSent).toLocaleDateString()}</p>` : ''}
                </div>
                <div class="flex gap-2">
                    <button onclick="updateStatus(${exec.id}, 'Responded')" 
                        class="p-2 rounded ${exec.status === 'Responded' ? 'bg-green-100' : 'bg-gray-100'}">
                        ✓
                    </button>
                    <button onclick="updateStatus(${exec.id}, 'No Response')" 
                        class="p-2 rounded ${exec.status === 'No Response' ? 'bg-red-100' : 'bg-gray-100'}">
                        ✗
                    </button>
                    <button onclick="deleteExecutive(${exec.id})" 
                        class="p-2 rounded hover:bg-red-100">
                        🗑
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = executivesHtml;
    updateDashboard();
}

function updateDashboard() {
    const total = executives.length;
    const responses = executives.filter(e => e.status === 'Responded').length;
    const rate = total ? Math.round((responses / total) * 100) : 0;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('responseCount').textContent = responses;
    document.getElementById('responseRate').textContent = rate + '%';
}

function clearForm() {
    document.getElementById('execName').value = '';
    document.getElementById('company').value = '';
    document.getElementById('title').value = '';
    document.getElementById('dateSent').value = '';
}

document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('root');
    app.innerHTML = `
        <div class="p-6 max-w-4xl mx-auto">
            <div class="bg-white shadow-lg rounded-lg p-6 mb-6">
                <h1 class="text-2xl font-bold mb-4">Executive Outreach Tracker</h1>
                
                <div class="space-y-4 mb-6">
                    <input type="text" id="execName" placeholder="Executive Name" 
                        class="w-full p-2 border rounded">
                    <input type="text" id="company" placeholder="Company" 
                        class="w-full p-2 border rounded">
                    <input type="text" id="title" placeholder="Title" 
                        class="w-full p-2 border rounded">
                    <div class="flex gap-4">
                        <input type="date" id="dateSent" 
                            class="w-1/2 p-2 border rounded">
                        <button onclick="addExecutive()" 
                            class="w-1/2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                            Add Executive
                        </button>
                    </div>
                </div>
            </div>

            <div id="executiveList" class="space-y-4"></div>

            <div class="bg-white shadow-lg rounded-lg p-6 mt-6">
                <h2 class="text-xl font-bold mb-4">Dashboard</h2>
                <div class="grid grid-cols-3 gap-4">
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                        <div id="totalCount" class="text-2xl font-bold">0</div>
                        <div class="text-gray-600">Total Outreach</div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                        <div id="responseCount" class="text-2xl font-bold">0</div>
                        <div class="text-gray-600">Responses</div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                        <div id="responseRate" class="text-2xl font-bold">0%</div>
                        <div class="text-gray-600">Response Rate</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    loadExecutives();
});
