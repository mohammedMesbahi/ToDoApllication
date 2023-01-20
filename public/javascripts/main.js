/* const btnlogout = document.getElementById('btnlogout');
btnlogout.addEventListener('click',() => {
    window.location.replace("./users/logout");
}) */
/* const btnAdd = document.getElementById("btnAdd");
btnAdd.addEventListener("click",() => {
    fetch("/users/createTask")
}) */
const list_button_delete = document.getElementsByClassName("btndelete");
var arr = Array.prototype.slice.call(list_button_delete);
arr.forEach(btn => {
    const taskId = btn.parentElement.id;
    console.log(taskId);
    btn.addEventListener('click', () => {
        fetch('/users/deleteTask', {
            method: 'POST',
            body: JSON.stringify({taskId:taskId}),
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
