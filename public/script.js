//ugly formatting on getOne
//clean up the database

var deleted = "";
const result = document.querySelector("#result");
const add = document.getElementById("add");
add.addEventListener("click", async function(e) {
    localStorage.removeItem("toChange");
    location.replace("/edit")
})
const addUser = document.getElementById("addUser");
addUser.addEventListener("click", async function(e) {
    localStorage.removeItem("toChange");
    location.replace("/editUser");
})

const fetchData = async function() {
    try {
        document.getElementById("search").value = "";
        const {data} = await axios.get("/tasks");
        let userData = await axios.get("/users");
        userData = userData.data;
        console.log(userData.data);
        console.log(data.data);
        let checked = "";
        let styled = "";
        let filtered = [];

        let userBoxes = userData.data.map((item) => {
            return `<div id="user${item.id}"><h1>${item.name}</h1><h5>Age: ${item.age}</h5><h5>User id: ${item.id}</h5><button class='edit-btn-users'>Edit User</button><button class='delete-btn-users'>Delete User</button><h5>Assigned tasks:</h5><div id="${item.name}Box" class="userBoxes"></div></div>`;
        })
        userBoxes.push(`<div id="unassigned"><h1>Unassigned Tasks:</h1><div id="unassignedBox" class="userBoxes"></div></div>`)
        result.innerHTML = userBoxes.join("");

        var userDeleteBtn = document.querySelectorAll(".delete-btn-users");
        for(let i = 0; i < userDeleteBtn.length; i++){
            let hi = userDeleteBtn[i];
            hi.addEventListener("click", async function (e) {
                console.log("yes?");
                let tasks = await axios.get("/tasks");
                tasks = tasks.data.data;
                for(let i = 0; i < tasks.length; i++) {
                    if(tasks[i].assignedTo == this.parentElement.firstElementChild.innerHTML) {
                        await axios.put(`/tasks/${tasks[i].id}`, {assignedTo: "none"});
                    }
                }
                await axios.delete(`/users/${this.parentElement.id.slice(4)}`);
                fetchData();
            })
        }
        var userEditBtn = document.querySelectorAll(".edit-btn-users");
        for(let i = 0; i < userEditBtn.length; i++){
            let hi = userEditBtn[i];
            hi.addEventListener("click", async function (e) {
                localStorage.setItem("toChange", this.parentElement.id);
                location.replace("/editUser");
            })
        }

        for(let i = 0; i < userData.data.length; i++){
            let hi = userData.data[i];
            filtered.push(data.data.filter((item) => {
                return item.assignedTo == hi.name;
            }))
        }
        filtered.push(data.data.filter((item) => {
            return item.assignedTo == "none";
        }))
        for(let i = 0; i <= userData.data.length; i++){
            filtered[i] = filtered[i].map((task) => {
                if(task.done == true) {
                    checked = "checked";
                    styled = "class='doneTask'"
                } else {
                    checked = "";
                    styled = "";
                }
                return `<div id='${task.id}' ${styled}><h1>${task.name}</h1><h5>ID: ${task.id}</h5><p>${task.description}</p><label for='check${task.id}'>Done:</label><input type='checkbox' id='check${task.id}' class='checks' ${checked}><button class='edit-btn'>Edit Task</button><button class='delete-btn'>Delete Task</button></div>`;
            })
        }
        for(let i = 0; i <= userData.data.length; i++) {
            if(userData.data.length == i) {
                document.getElementById("unassignedBox").innerHTML = filtered[i].join("")
            } else {
                document.getElementById(userData.data[i].name + "Box").innerHTML = filtered[i].join("");
            }
        }

        var deleteBtn = document.querySelectorAll(".delete-btn");
        for(let i = 0; i < deleteBtn.length; i++){
            let hi = deleteBtn[i];
            hi.addEventListener("click", async function (e) {
                await axios.delete(`/tasks/${this.parentElement.id}`);
                fetchData();
            })
        }
        var editBtn = document.querySelectorAll(".edit-btn");
        for(let i = 0; i < editBtn.length; i++){
            let hi = editBtn[i];
            hi.addEventListener("click", async function (e) {
                localStorage.setItem("toChange", this.parentElement.id);
                location.replace("/edit");
            })
        }

        var checks = document.querySelectorAll(".checks");
        for(let i = 0; i < checks.length; i++) {
            let hi = checks[i];
            hi.addEventListener("click", async function(e) {
                let {data} = await axios.get(`/tasks/${this.parentElement.id}`);
                data = data.data;
                if(data.done == false) {
                    this.parentElement.classList.add("doneTask")
                    await axios.put(`/tasks/${this.parentElement.id}`, {name: data.name, desc: data.description, id: data.id, done: true, assignedTo: data.assignedTo})
                } else {
                    this.parentElement.classList.remove("doneTask");
                    await axios.put(`/tasks/${this.parentElement.id}`, {name: data.name, desc: data.description, id: data.id, done: false})
                }
            })
        }
    } catch(err) {
        console.log(err);
    }
}
fetchData()

const fetchOnlyTasks = async function() {
        try {
        document.getElementById("search").value = "";
        const {data} = await axios.get("/tasks");
        console.log(data.data);
            const tasks = data.data.map((task) => {
            if(task.done == true) {
                checked = "checked";
                styled = "class='doneTask'"
            } else {
                checked = "";
                styled = "";
            }
            return `<div id='${task.id}' ${styled}><h1>${task.name}</h1><h5>ID: ${task.id}</h5><p>${task.description}</p><label for='check${task.id}'>Done:</label><input type='checkbox' id='check${task.id}' class='checks' ${checked}><button class='edit-btn'>Edit Task</button><button class='delete-btn'>Delete Task</button></div>`
        });

        result.innerHTML = tasks.join("");

        var deleteBtn = document.querySelectorAll(".delete-btn");
        for(let i = 0; i < deleteBtn.length; i++){
            let hi = deleteBtn[i];
            hi.addEventListener("click", async function (e) {
                await axios.delete(`/tasks/${this.parentElement.id}`);
                fetchOnlyTasks();
            })
        }
        var editBtn = document.querySelectorAll(".edit-btn");
        for(let i = 0; i < editBtn.length; i++){
            let hi = editBtn[i];
            hi.addEventListener("click", async function (e) {
                localStorage.setItem("toChange", this.parentElement.id);
                location.replace("/edit");
            })
        }

        var checks = document.querySelectorAll(".checks");
        for(let i = 0; i < checks.length; i++) {
            let hi = checks[i];
            hi.addEventListener("click", async function(e) {
                let {data} = await axios.get(`/tasks/${this.parentElement.id}`);
                data = data.data;
                if(data.done == false) {
                    this.parentElement.classList.add("doneTask")
                    await axios.put(`/tasks/${this.parentElement.id}`, {name: data.name, desc: data.description, id: data.id, done: true, assignedTo: data.assignedTo})
                } else {
                    this.parentElement.classList.remove("doneTask");
                    await axios.put(`/tasks/${this.parentElement.id}`, {name: data.name, desc: data.description, id: data.id, done: false})
                }
            })
        }
    } catch(err) {
        console.log(err);
    }
}

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", async function (e) {
    console.log(e);
    e.preventDefault();
    let {data} = await axios.get(`/tasks/${document.getElementById("search").value}`);
    console.log(data);
    if(data.success == false || !document.getElementById("search").value) {
        document.getElementById("message").innerHTML = "Please enter a valid id";
    } else {
        document.getElementById("message").innerHTML = "";
        let searchId = document.getElementById("search").value;
        getOne(searchId);
    }
})
async function getOne(id) {
    let {data} = await axios.get(`/tasks/${id}`);
    data = data.data;
    console.log(data);
    let checked = "";
    let styled = "";

    if(data.done == true) {
        checked = "checked";
        styled = "class='doneTask'"
    }
    result.innerHTML = `<div id='${data.id}' ${styled}><h1>${data.name}</h1><h5>ID: ${data.id}</h5><p>${data.description}</p><label for='check${data.id}'>Done:</label><input type='checkbox' id='check${data.id}' class='checks' ${checked}><button class='edit-btn'>Edit Task</button><button class='delete-btn'>Delete Task</button></div>`;
    var deleteBtn = document.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", async function (e) {
        await axios.delete(`/tasks/${this.parentElement.id}`);
        fetchData();;
    })
    var editBtn = document.querySelector(".edit-btn");
    editBtn.addEventListener("click", async function (e) {
        localStorage.setItem("toChange", this.parentElement.id);
        location.replace("/edit");
    })
    var checks = document.querySelector(".checks");
    checks.addEventListener("click", async function(e) {
        let {data} = await axios.get(`/tasks/${this.parentElement.id}`);
        console.log(data);
        data = data.data;
        console.log(data);
        if(data.done == false) {
            this.parentElement.classList.add("doneTask")
            await axios.put(`/tasks/${this.parentElement.id}`, {name: data.name, desc: data.description, id: data.id, done: true})
        } else {
            this.parentElement.classList.remove("doneTask");
            await axios.put(`/tasks/${this.parentElement.id}`, {name: data.name, desc: data.description, id: data.id, done: false})
        }
    })
}

const userSearchBtn = document.getElementById("userSearchBtn");
userSearchBtn.addEventListener("click", async function (e) {
    console.log(e);
    e.preventDefault();
    let {data} = await axios.get(`/users/${document.getElementById("userSearch").value}`);
    console.log(data);
    if(data.success == false || !document.getElementById("userSearch").value) {
        document.getElementById("userMessage").innerHTML = "Please enter a valid id";
    } else {
        document.getElementById("userMessage").innerHTML = "";
        let searchId = document.getElementById("userSearch").value;
        getOneUser(searchId);
    }
})
async function getOneUser(id) {
    try {
        document.getElementById("search").value = "";
        const {data} = await axios.get("/tasks");
        let userData = await axios.get(`/users/${id}`);
        userData = userData.data.data;
        console.log(userData);
        console.log(data.data);
        let checked = "";
        let styled = "";
        let filtered = [];

        result.innerHTML = `<div id="user${userData.id}"><h1>${userData.name}</h1><h5>Age: ${userData.age}</h5><h5>User id: ${userData.id}</h5><button class='edit-btn-users'>Edit User</button><button class='delete-btn-users'>Delete User</button><h5>Assigned tasks:</h5><div id="${userData.name}Box" class="userBoxes"></div></div>`;

        var userDeleteBtn = document.querySelectorAll(".delete-btn-users");
        for(let i = 0; i < userDeleteBtn.length; i++){
            let hi = userDeleteBtn[i];
            hi.addEventListener("click", async function (e) {
                await axios.delete(`/users/${this.parentElement.id}`);
                fetchData();
            })
        }
        var userEditBtn = document.querySelectorAll(".edit-btn-users");
        for(let i = 0; i < userEditBtn.length; i++){
            let hi = userEditBtn[i];
            hi.addEventListener("click", async function (e) {
                localStorage.setItem("toChange", this.parentElement.id);
                location.replace("/editUser");
            })
        }
        let miniFiltered = data.data.filter((item) => {
            return item.assignedTo == userData.name;
        })
        miniFiltered = miniFiltered.map((task) => {
            if(task.done == true) {
                checked = "checked";
                styled = "class='doneTask'"
            } else {
                checked = "";
                styled = "";
            }
            return `<div id='${task.id}' ${styled}><h1>${task.name}</h1><h5>ID: ${task.id}</h5><p>${task.description}</p><label for='check${task.id}'>Done:</label><input type='checkbox' id='check${task.id}' class='checks' ${checked}><button class='edit-btn'>Edit Task</button><button class='delete-btn'>Delete Task</button></div>`;
        })
        document.getElementById(userData.name + "Box").innerHTML = miniFiltered.join("");

        var deleteBtn = document.querySelectorAll(".delete-btn");
        for(let i = 0; i < deleteBtn.length; i++){
            let hi = deleteBtn[i];
            hi.addEventListener("click", async function (e) {
                await axios.delete(`/tasks/${this.parentElement.id}`);
                fetchData();
            })
        }
        var editBtn = document.querySelectorAll(".edit-btn");
        for(let i = 0; i < editBtn.length; i++){
            let hi = editBtn[i];
            hi.addEventListener("click", async function (e) {
                localStorage.setItem("toChange", this.parentElement.id);
                location.replace("/edit");
            })
        }

        var checks = document.querySelectorAll(".checks");
        for(let i = 0; i < checks.length; i++) {
            let hi = checks[i];
            hi.addEventListener("click", async function(e) {
                let {data} = await axios.get(`/tasks/${this.parentElement.id}`);
                data = data.data;
                if(data.done == false) {
                    this.parentElement.classList.add("doneTask")
                    await axios.put(`/tasks/${this.parentElement.id}`, {name: data.name, desc: data.description, id: data.id, done: true, assignedTo: data.assignedTo})
                } else {
                    this.parentElement.classList.remove("doneTask");
                    await axios.put(`/tasks/${this.parentElement.id}`, {name: data.name, desc: data.description, id: data.id, done: false})
                }
            })
        }
    } catch(err) {
        console.log(err);
    }
}