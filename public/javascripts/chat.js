
const form = document.querySelector("#typebox")
const input = document.querySelector("#message-input")
const messages = document.querySelector(".messages")
const socket = io();

form.addEventListener("submit", ev => {
    ev.preventDefault()
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
})

socket.on('chat message', (msg) => {
    const item = document.createElement('p');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
