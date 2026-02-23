function checkinput() {

    let edit = document.getElementById('newTodo')
    let button = document.getElementById('submitButton')
    // return;
    let text = edit.value.trim()
    if (text === '')
        button.setAttribute('disabled', '')
    else
        button.removeAttribute('disabled');
}

function init() {
    let edit = document.getElementById('newTodo')
    edit.setAttribute("oninput", "checkinput()");
    checkinput();
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = 'Ladataan tehtävälista palvelimelta, odota...'
    loadTodos()
}
async function loadTodos() {
    let response = await fetch('http://localhost:3000/todos')
    let todos = await response.json()
    console.log(todos)
    showTodos(todos)
}

function createTodoListItem(todo) {
    let li = document.createElement('li'); // create a new LI element
    let li_attr = document.createAttribute('id'); // create a new id attribute
    li_attr.value = todo._id; // assign the todo task's id value to the created attribute
    li.setAttributeNode(li_attr); // attach the attribute node to the LI element

    let textNode = document.createElement('span');
    let text_attr = document.createAttribute('class')
    text_attr.value = 'text'
    textNode.setAttributeNode(text_attr)

    textNode.innerHTML = todo.text; // create a new text node containing the todo task text


    li.appendChild(textNode); // append the text node to the LI element



    // lisätään editointimahdollisuus
    let edit = document.createElement('span')
    let edit_attr = document.createAttribute('class')
    edit_attr.value = 'edit'
    edit.setAttributeNode(edit_attr)
    let edit_btn = document.createTextNode(' [Muokkaa] ')
    edit.appendChild(edit_btn)
    edit.onclick = function () { doEdit(todo._id) }
    li.appendChild(edit)




    let span = document.createElement('span'); // create a new SPAN element (an 'x' mark to delete the task)
    let span_attr = document.createAttribute('class'); // create a new class attribute
    span_attr.value = 'delete'; // set the attribute value to 'delete' (class="delete") for styling
    span.setAttributeNode(span_attr); // attach the class attribute to the SPAN element
    let x = document.createTextNode(' [x] '); // create a text node with the value ' x '
    span.appendChild(x); // append the 'x' text node to the SPAN element (making it visible)
    span.onclick = function () { removeTodo(todo._id) }; // set the SPAN's onclick event to call the removeTodo function
    li.appendChild(span); // append the SPAN element to the LI element

    // return the created LI element
    // it follows this format: <li id="mongoIDXXXXX">Task text...<span class="delete"> x </span></li>
    return li;
}


function showTodos(todos) {
    let todosList = document.getElementById('todosList')
    let infoText = document.getElementById('infoText')



    // no todos
    if (todos.length === 0) {
        infoText.innerHTML = 'Ei tehtäviä'
    } else {
        todosList.replaceChildren();
        todos.forEach(todo => {
            let li = createTodoListItem(todo)
            todosList.appendChild(li)
        })
        infoText.innerHTML = ''
    }
}

async function addTodo() {
    let newTodo = document.getElementById('newTodo')
    const data = { 'text': newTodo.value }
    const response = await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    let todo = await response.json()
    let todosList = document.getElementById('todosList')
    let li = createTodoListItem(todo)
    todosList.appendChild(li)

    let infoText = document.getElementById('infoText')
    infoText.innerHTML = ''
    newTodo.value = ''
}
async function removeTodo(id) {
    const response = await fetch('http://localhost:3000/todos/' + id, {
        method: 'DELETE'
    })
    let responseJson = await response.json()
    let li = document.getElementById(id)
    li.parentNode.removeChild(li)

    let todosList = document.getElementById('todosList')
    if (!todosList.hasChildNodes()) {
        let infoText = document.getElementById('infoText')
        infoText.innerHTML = 'Ei tehtäviä'
    }


}
function doEdit(id) {
    if (window.confirm('Haluatko varmasti päivittää tehtävän?') === false)
        return;

    let edit = document.getElementById('newTodo')
    let li = document.getElementById(id)
    let text = li.querySelector('.text')
    edit.value = text.innerHTML;
    changeButton(id);
}

function changeButton(id) {
    let button = document.getElementById('submitButton');
    if (button.innerHTML == "Lisää") {
        // Vaihdetaan painikkeen teksti ja toiminto muokkaustilaan
        button.innerHTML = "Tallenna";
        button.className = "editButton"; // Muuttaa tyyliä, esim.  muokkauspainikkeen värin 
        button.setAttribute("onclick", `updateTodo("${id}")`); // Muokkaa olemassa olevaa tehtävää
    } else {
        // Palautetaan painike lisäystilaan
        button.innerHTML = "Lisää";
        button.className = "addButton";
        button.setAttribute("onclick", "addTodo()"); // Lisää uusi tehtävä
    }
}


async function updateTodo(id) {
    let newTodo = document.getElementById('newTodo'); // Haetaan päivitetty teksti
    const data = { 'text': newTodo.value }; // Muodostetaan JSON-data lähetettäväksi

    // Muodostetaan URL, johon tehtävä päivitetään, käyttämällä tehtävän ID:tä
    let url = "http://localhost:3000/todos/" + id;

    // Lähetetään PUT-pyyntö palvelimelle, joka päivittää tehtävän
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Lähetetään päivitetty teksti palvelimelle
    });
    let responseJson = await response.json()
    console.log(responseJson);

    let infoText = document.getElementById('infoText');
    // Päivitetään tehtävälista, jotta muutokset näkyvät käyttöliittymässä
    if (response.status === 400) {
        infoText.innerHTML = responseJson.error;
        return
    }
    loadTodos();

    // Tyhjennetään tekstikenttä ja päivitetään painikkeen toiminto takaisin lisäystilaan

    infoText.innerHTML = '';
    newTodo.value = ''; // Tyhjennä tekstikenttä
    changeButton(); // Vaihdetaan painike takaisin lisäystilaan
}
