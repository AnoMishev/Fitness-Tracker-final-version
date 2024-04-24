export class ModalDiv extends HTMLElement {
    constructor() {
        super();
        this.classList.add('modal-ctr');
        this.innerHTML = `           <div class="modal-content">
        <form id="form">
            <p class="form-item">
            <label for="title">Workout</label>
            <input type="text" name="title" id="title">
            </p>

            <p class="form-item">
            <label for="calories">Calories</label>
            <input type="number" name="calories" id="calories">
            </p>

            <p class="form-item">
            <label>Duration</label>
            <input type="number" name="hours" id="hours">
            <input type="number" name="minutes" id="minutes">
            <input type="number" name="seconds" id="seconds">
            </p>

            <p class="form-item">
            <label for="type">Workout Type</label>
            <select name="type" id="type">
            <option value="cycling">Cycling</option>
            <option value="running">Running</option>
            <option value="cardio">Cardio</option>
            <option value="boxing">Boxing</option>
            </select>
            </p>
            <p class="form-item">
            <button type="submit" id="submit">Save Workout</button>
            </p>
        </form>
    </div>
        `
    }
}