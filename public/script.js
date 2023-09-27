//the checks need edit functionality

const result = document.querySelector("#result");
const add = document.getElementById("add");
add.addEventListener("click", async function(e) {
    localStorage.removeItem("toChange");
    location.replace("/edit")
})

const fetchData = async function() {
    try {
        document.getElementById("search").value = "";
        const {data} = await axios.get("/tasks");
        console.log(data);
        let checked = "";
        let styled = "";

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
        //ugly, but functional
        //needs edit functionality
        var checks = document.querySelectorAll(".checks");
        for(let i = 0; i < checks.length; i++) {
            let hi = checks[i];
            hi.addEventListener("click", async function(e) {
                let {data} = await axios.get(`/tasks/${this.parentElement.id}`);
                console.log(data);
                data = data.data;
                console.log(data);
                //it ain't right if it's already checked
                if(data.done == false) {
                    this.parentElement.classList.add("doneTask")
                    await axios.put(`/tasks/${this.parentElement.id}`, {name: data.name, desc: data.description, id: data.id, done: true})
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