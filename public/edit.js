let changeId = localStorage.getItem("toChange");
let submitBtn = document.getElementById("submitBtn");
let nameInput = document.getElementById("name");
let idInput = document.getElementById("id");
let descInput = document.getElementById("desc");
let returnBtn = document.getElementById("returnBtn");
let done = false;
returnBtn.addEventListener("click", async function(e) {
    localStorage.removeItem("toChange");
    location.replace("/");
})

async function fillOut() {
    if(changeId != null) {
        let {data} = await axios.get(`/tasks/${changeId}`);
        data = data.data;
        console.log(data);
        nameInput.value = data.name;
        idInput.value = data.id;
        descInput.value = data.description;
        done = data.done;
    }
}
fillOut();

//needs work!
submitBtn.addEventListener("click", async function(e) {
    e.preventDefault();
    let {data} = await axios.get(`/tasks/${Number(idInput.value)}`);
    if(data.success == true && changeId == null) {
        document.getElementById("message").innerHTML = "That ID is already taken. Please pick another."
    } else {
        if(!nameInput.value || !idInput.value || !descInput.value) {
            document.getElementById("message").innerHTML = "Please fill out all fields"
        } else if(changeId == null) {
            let response = await axios.post("/tasks", {name: nameInput.value, id: Number(idInput.value), desc: descInput.value});
            if(response.success == false) {
                document.getElementById("message").innerHTML = response.msg;
            } else {
                document.getElementById("message").innerHTML = "Success!";    
            }
        } else {
            let response = await axios.put(`/tasks/${changeId}`, {name: nameInput.value, desc: descInput.value, id: Number(idInput.value), done: done});
            console.log(response);
            if(response.data.success == true) {
                document.getElementById("message").innerHTML = "Success!";
            } else {
                document.getElementById("message").innerHTML = "Something went wrong";   
            }
        }
    }
})