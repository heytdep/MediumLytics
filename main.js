const textContent = [
    'Developer',
    'Content Creator',
    'Crypto Trader and Investor',
    'Security Researcher',
]

const textField = document.getElementById('extName');

const typewriter = new Typewriter(textField, {
    loop: true,
    delay: 200,
    cursor: ''
});

typewriter
    .pauseFor(2500)
    .typeString(`<span id="text">MediumLytics</span>
`)

    .start()

const textField1 = document.querySelector('.subtitle');

const typewriter1 = new Typewriter(textField1, {
    loop: true,
    delay: 200,
    cursor: ''
});

typewriter1
    .typeString(`<span>Introducing</span>`)
    .pauseFor(2900)
    .start()

/*
 .typeString(`<span id="text" style="color: black">M</span>
    <span id="text" style="color: #bb00ff">e</span>
    <span id="text" style="color: black">d</span>
        <span id="text" style="color: #bb00ff">i</span>
    <span id="text" style="color: black">u</span>
        <span id="text" style="color: #bb00ff">m</span>
    <span id="text" style="color: black">L</span>
        <span id="text" style="color: #bb00ff">y</span>
    <span id="text" style="color: black">t</span>
        <span id="text" style="color: #bb00ff">i</span>
    <span id="text" style="color: black">c</span>
    <span id="text" style="color: #bb00ff">s</span>
`)

 */
