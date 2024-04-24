export class FitHeader extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `<h1 id="fit-header-title">Fitness Tracker app</h1>
        <button id="change" class="dark">dark mode</button>`

        this.classList.add('fit-header')
    }
}

