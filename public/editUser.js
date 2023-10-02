let changeId = localStorage.getItem("toChange").slice(4);
let submitBtn = document.getElementById("submitBtn");
let nameInput = document.getElementById("name");
let idInput = document.getElementById("id");
let ageInput = document.getElementById("age");
let returnBtn = document.getElementById("returnBtn");
let done = false;

returnBtn.addEventListener("click", async function(e) {
    localStorage.removeItem("toChange");
    location.replace("/");
})

async function fillOut() {
    if(changeId != null) {
        let {data} = await axios.get(`/users/${changeId}`);
        data = data.data;
        nameInput.value = data.name;
        idInput.value = data.id;
        ageInput.value = data.age;
    }
}
fillOut();

submitBtn.addEventListener("click", async function(e) {
    e.preventDefault();
    let {data} = await axios.get(`/users/${Number(idInput.value)}`);
    if(data.success == true && changeId == null) {
        document.getElementById("message").innerHTML = "That ID is already taken. Please pick another."
    } else {
        if(!nameInput.value || !idInput.value || !ageInput.value) {
            document.getElementById("message").innerHTML = "Please fill out all fields"
        } else if(changeId == null) {
            let response = await axios.post("/users", {name: nameInput.value, id: Number(idInput.value), age: ageInput.value});
            if(response.success == false) {
                document.getElementById("message").innerHTML = response.msg;
            } else {
                document.getElementById("message").innerHTML = "Success!";    
            }
        } else {
            let response = await axios.put(`/users/${changeId}`, {name: nameInput.value, age: ageInput.value, id: Number(idInput.value)});
            console.log(response);
            if(response.data.success == true) {
                document.getElementById("message").innerHTML = "Success!";
            } else {
                document.getElementById("message").innerHTML = "Something went wrong";   
            }
        }
    }
})