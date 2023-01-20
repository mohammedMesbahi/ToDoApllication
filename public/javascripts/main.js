
const btnlogout = document.getElementById('btnlogout');
btnlogout.addEventListener('click', () => {
    fetch('/users/logout', {
        method: 'post',
        credentials: 'include',
        redirect: 'follow'
    })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        })
        .catch(function (error) {
            console.warn('Something went wrong.', error);
        });
})
const btnAdd = document.getElementById("btnAdd");
btnAdd.addEventListener('click', () => {
    const task = document.getElementsByClassName('input__field').value;

        fetch("/users/createTask", {
        methode: 'POST',
        body: JSON.stringify({ task: task }),
        credentials: 'include',
        redirect: 'follow',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        }
    })
    .catch(function (error) {
        console.warn('Something went wrong.', error);
    });
    
})

const list_button_delete = document.getElementsByClassName("btndelete");
var arr = Array.prototype.slice.call(list_button_delete);
arr.forEach(btn => {
    const taskId = btn.parentElement.id;
    btn.addEventListener('click', () => {
        fetch('/users/deleteTask', {
            method: 'DELETE',
            body: JSON.stringify({ taskId: taskId }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            credentials:'include'
        }).then(function (response) {
            if (response.ok) {
                btn.parentElement.remove();
            }
        })
            .catch(function (error) {
                console.warn('Something went wrong.', error);
            });
    })
});
