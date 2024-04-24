export class FitAside extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = ` 
        <section class="aside-section">
        <h2>My Workouts</h2>
        <p id="calls">Total cals:</p>
        <p class="sorting">
        <label for="sortBy">Sort By</label>
        <select name="sortBy" id="sortBy">
            <option value="calories">Calories</option>
            <option value="time">Time</option>
        </select>
        </p>
    </section>
    <ul id="list">
    </ul>`
        this.classList.add('fit-aside')
    }
}

