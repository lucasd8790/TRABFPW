const form = document.getElementById("taskForm");
const list = document.getElementById("taskList");
const search = document.getElementById("search");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Salvar dados
function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Adicionar tarefa
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const desc = document.getElementById("description").value.trim();
    const priority = document.getElementById("priority").value;

    if (!title || !desc || !priority) {
        alert("Preencha todos os campos!");
        return;
    }

    tasks.push({
        id: Date.now(),
        title,
        desc,
        date: new Date().toLocaleString(),
        priority,
        status: "Pendente"
    });

    save();
    render();
    form.reset();
});

// Buscar
search.addEventListener("input", () => render(search.value));

// Renderizar tarefas
function render(filter = "") {
    list.innerHTML = "";

    const filtered = tasks.filter(t =>
        t.title.toLowerCase().includes(filter.toLowerCase())
    );

    if (tasks.length === 0) {
        list.innerHTML = "<p>Nenhuma tarefa cadastrada.</p>";
        return;
    }

    if (filtered.length === 0) {
        list.innerHTML = "<p>Nenhuma tarefa encontrada.</p>";
        return;
    }

    filtered.forEach(t => {
        const div = document.createElement("div");

        let classe = "";
        if (t.priority === "Alta") classe = "alta";
        if (t.priority === "Média") classe = "media";
        if (t.priority === "Baixa") classe = "baixa";

        if (t.status === "Concluída") {
            div.style.textDecoration = "line-through";
            div.style.opacity = "0.6";
        }

        div.className = `task ${classe}`;

        div.innerHTML = `
            <b>${t.title}</b><br>
            ${t.desc}<br>
            <small>${t.date}</small><br>
            <small>Prioridade: ${t.priority}</small><br>
            <small>Status: ${t.status}</small><br><br>

            <button onclick="toggle(${t.id})">Concluir</button>
            <button onclick="edit(${t.id})">Editar</button>
            <button onclick="removeTask(${t.id})">Excluir</button>
        `;

        list.appendChild(div);
    });
}

// Concluir tarefa
function toggle(id) {
    tasks.forEach(t => {
        if (t.id === id) {
            t.status = t.status === "Pendente" ? "Concluída" : "Pendente";
        }
    });
    save();
    render();
}

// Editar
function edit(id) {
    const t = tasks.find(t => t.id === id);

    const newTitle = prompt("Novo título:", t.title);
    const newDesc = prompt("Nova descrição:", t.desc);

    if (newTitle && newDesc) {
        t.title = newTitle;
        t.desc = newDesc;
        save();
        render();
    }
}

// Excluir
function removeTask(id) {
    if (confirm("Excluir tarefa?")) {
        tasks = tasks.filter(t => t.id !== id);
        save();
        render();
    }
}

// Inicializar
render();