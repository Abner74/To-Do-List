const taskInput = document.getElementById('new-task');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, idx) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';

        // Título e detalhes
        const taskContent = document.createElement('div');
        taskContent.style.flex = '1';
        taskContent.innerHTML = `<strong>${task.title}</strong><br><small>${task.details || ''}</small>`;

        // Botão concluir
        const completeBtn = document.createElement('button');
        completeBtn.textContent = task.completed ? 'Desfazer' : 'Concluir';
        completeBtn.style.background = '#74ebd5';
        completeBtn.onclick = () => {
            tasks[idx].completed = !tasks[idx].completed;
            saveTasks();
            renderTasks();
        };

        // Botão editar
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.style.background = '#f7b731';
        editBtn.onclick = () => editTask(idx);

        // Botão remover
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remover';
        removeBtn.onclick = () => {
            tasks.splice(idx, 1);
            saveTasks();
            renderTasks();
        };

        li.appendChild(taskContent);
        li.appendChild(completeBtn);
        li.appendChild(editBtn);
        li.appendChild(removeBtn);
        taskList.appendChild(li);
    });

    renderTotal();
}

function renderTotal() {
    let totalDiv = document.getElementById('total-tasks');
    if (!totalDiv) {
        totalDiv = document.createElement('div');
        totalDiv.id = 'total-tasks';
        totalDiv.style.marginTop = '20px';
        totalDiv.style.textAlign = 'right';
        taskList.parentNode.appendChild(totalDiv);
    }
    totalDiv.innerHTML = `<strong>Total de tarefas:</strong> ${tasks.length}`;
}

addTaskBtn.onclick = () => {
    const title = taskInput.value.trim();
    if (!title) return;
    showDetailsModal(title);
};

function showDetailsModal(title, idx = null) {
    const details = idx !== null ? tasks[idx].details : '';
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.3)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000';

    modal.innerHTML = `
        <div style="background:#fff;padding:24px;border-radius:12px;min-width:300px;box-shadow:0 2px 16px #0002;">
            <label><strong>Tarefa:</strong></label>
            <input type="text" id="modal-title" value="${title}" style="width:100%;margin-bottom:12px;padding:8px;border-radius:6px;border:1px solid #ccc;">
            <label><strong>Detalhes:</strong></label>
            <textarea id="modal-details" style="width:100%;height:60px;padding:8px;border-radius:6px;border:1px solid #ccc;">${details || ''}</textarea>
            <div style="margin-top:16px;text-align:right;">
                <button id="modal-save" style="background:#74ebd5;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;">Salvar</button>
                <button id="modal-cancel" style="margin-left:8px;background:#ccc;color:#333;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;">Cancelar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('modal-save').onclick = () => {
        const newTitle = document.getElementById('modal-title').value.trim();
        const newDetails = document.getElementById('modal-details').value.trim();
        if (!newTitle) return;
        if (idx !== null) {
            tasks[idx].title = newTitle;
            tasks[idx].details = newDetails;
        } else {
            tasks.push({ title: newTitle, details: newDetails, completed: false });
        }
        saveTasks();
        renderTasks();
        document.body.removeChild(modal);
        taskInput.value = '';
    };
    document.getElementById('modal-cancel').onclick = () => {
        document.body.removeChild(modal);
    };
}

function editTask(idx) {
    showDetailsModal(tasks[idx].title, idx);
}

// Enter para adicionar
taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTaskBtn.click();
});

// Inicializa
renderTasks();