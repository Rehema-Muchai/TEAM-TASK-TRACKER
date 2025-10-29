// Sample data
let teamMembers = [
        { id: 1, name: "Emma Muchai", email: "ema@example.com", role: "Actress" },
        { id: 2, name: "Nara Smith", email: "nara@example.com", role: "Screen Player" },
        { id: 3, name: "Cole Brooks", email: "cole@example.com", role: "Director" }
];

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// DOM elements
const teamSection = document.getElementById('teamSection');
const assigneeSelect = document.getElementById('assigneeSelect');
const filterSelect = document.getElementById('filterSelect');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Render team members
function renderTeam() {
        teamSection.innerHTML = '';
        assigneeSelect.innerHTML = '';
        filterSelect.innerHTML = '<option value="all">All Members</option>';

        teamMembers.forEach(member => {
                // Team card
                const card = document.createElement('div');
                card.textContent = `${member.name} (${member.role})`;
                teamSection.appendChild(card);

                // Assignee dropdown
                const option = document.createElement('option');
                option.value = member.id;
                option.textContent = member.name;
                assigneeSelect.appendChild(option);

                // Filter dropdown
                const filterOption = option.cloneNode(true);
                filterSelect.appendChild(filterOption);
        });
}

// Save tasks
function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks(filterId = 'all') {
        taskList.innerHTML = '';
        let filteredTasks = filterId === 'all' ? tasks : tasks.filter(t => t.assignedTo == filterId);

        filteredTasks.forEach(task => {
                const li = document.createElement('li');
                const member = teamMembers.find(m => m.id === task.assignedTo);
                li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''}>
      <span class="${task.completed ? 'task-completed' : ''}">
        ${task.description} - ${member.name}
      </span>
      <button>Delete</button>
    `;

                // Toggle completion
                li.querySelector('input').addEventListener('change', () => {
                        task.completed = !task.completed;
                        saveTasks();
                        renderTasks(filterSelect.value);
                });

                // Delete task
                li.querySelector('button').addEventListener('click', () => {
                        tasks = tasks.filter(t => t.id !== task.id);
                        saveTasks();
                        renderTasks(filterSelect.value);
                });

                taskList.appendChild(li);
        });
}

// Add task
taskForm.addEventListener('submit', e => {
        e.preventDefault();
        const description = taskInput.value.trim();
        const assignedTo = parseInt(assigneeSelect.value);
        if (!description || !assignedTo) return alert('Fill all fields');

        const newTask = {
                id: Date.now(),
                description,
                assignedTo,
                completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks(filterSelect.value);
        taskInput.value = '';
});

// Filter tasks
filterSelect.addEventListener('change', () => {
        renderTasks(filterSelect.value);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
        renderTeam();
        renderTasks();
});
