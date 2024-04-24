import { FitMain } from './fit-main.js'
import { FitHeader } from './fit-header.js';
import { FitFooter } from './fit-footer.js';
import { FitAside } from './fit-aside.js';
import { ModalDiv } from './modal.component.js';

export class FitTracker extends HTMLElement {

    constructor() {
        super();
        this.innerHTML = `
        <modal-ctr></modal-ctr>
        <fit-header></fit-header>
        <fit-main></fit-main>
        <fit-aside></fit-aside>
        <fit-footer></fit-footer>`
        this.classList.add('fit-tracker')
        navigator.geolocation.getCurrentPosition(this.success, this.error);
    }

    success(location) {
        let {latitude : lat, longitude: lng} = location.coords;
        let workouts = [];
        let markers = [];
    
        let workoutIcons = {
            cycling: 'directions_bike',
            running: `directions_run`,
            boxing: `sports_mma`,
            cardio: `fitness_center`
        }
    
        let map = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 20,
                attribution: '© <a href="https://stadiamaps.com/">Stadia Maps</a>, © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            }).addTo(map);
        
        map.on('click', click);
    
        let button = document.getElementById('change')
        button.addEventListener('click', (e) => { 
            let body = document.body;
            let dataType = body.getAttribute('data-theme')
            if (dataType === 'dark') {
                body.setAttribute('data-theme', 'light')
                button.removeAttribute('dark')
            button.innerHTML = 'light mode'
            
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 20,
                attribution: '© <a href="https://stadiamaps.com/">Stadia Maps</a>, © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            }).addTo(map);}
            else if(dataType === 'light') {
                body.setAttribute('data-theme', 'dark')
                button.removeAttribute('dark')
                button.innerHTML = 'dark mode'
                
                L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
            }
        })
    
        
    
    function click(e) {
            let modalCtr = document.querySelector('.modal-ctr')
            let {lat, lng} = e.latlng;
    
            let form = document.querySelector('#form');
            modalCtr.classList.add('opened');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                let formData = new FormData(form);
                let formDataReal = Object.fromEntries(formData);
                addTo(lat, lng, formDataReal);
                hide(modalCtr, form);
            })
            
        }
    
    function hide(modal, form) {
            modal.classList.remove('opened');
            form.reset()
        }

    function addTo(lat, lng, data) {
        workouts.push({
            title: data.title,
            calories: data.calories,
            duration: `${data.hours}hours ${data.minutes}min ${data.seconds}sec`,
            type: data.type,
            coords: {
                lat: lat,
                lng: lng
            },
            
            timestamp: new Date().getTime()
        })
        
        localStorage.setItem('FT-Workout', JSON.stringify(workouts));
        markers.forEach((marker) => {
            marker.removeFrom(map)
        })
        loadWorkouts()
    }
    
    
    function loadWorkouts() {
        let savedWorkouts = localStorage.getItem('FT-Workout');
        if (!savedWorkouts) {
            localStorage.setItem('FT-Workout', '[]');
            savedWorkouts = localStorage.getItem('FT-Workout')
        }
        workouts = JSON.parse(savedWorkouts)
        markers = workouts.map((workout) => {
            return L.marker([workout.coords.lat, workout.coords.lng]).addTo(map);
        })
        upDate()
        
    }
    
    function upDate() {
        const list = document.getElementById('list');
        let calls = document.getElementById('calls');
        let totalCalls = 0;
        list.innerHTML = '';
    
        // Sort workouts based on selected option
        let sortBy = document.getElementById('sortBy').value;
        let sortedWorkouts = sortBy === 'calories' ? sortWorkouts(workouts) : sortTime(workouts);
        sortedWorkouts.forEach((workout, i) => {

            totalCalls += Number(workout.calories);
            let li = document.createElement('li');
            li.id = `${i}`;
            li.innerHTML = `
            <h3><span class="material-symbols-outlined " id="workout-title-id">${workoutIcons[`${workout.type}`]} </span> Workout Title: ${workout.title}</h3>
             <p><span class="material-symbols-outlined" id="span-cals">
             bolt
             </span> Calories: ${workout.calories} kcal</p>
             <p><span class="material-symbols-outlined" id="span-duration">
             acute
             </span> Duration: ${workout.duration}</p>`
            calls.innerHTML = `Total Calls: ${totalCalls}`;
            list.appendChild(li);
            li.onclick = (e) => {
                map.panTo(markers[Number(li.id)].getLatLng());
                console.log(markers[Number(li.id)].getLatLng());
            }
        });
    }
    
    // Event listener for changing the sorting option
    let sortBy = document.getElementById('sortBy');
    sortBy.addEventListener('change', upDate);
    
    function sortWorkouts(workouts) {
        return workouts.slice().sort((a, b) => b.calories - a.calories); // Make a copy of workouts to avoid mutating the original array
    }
    
    function sortTime(workouts) {
        return workouts.slice().sort((a, b) => {
            let durationA = getTotalSeconds(a.duration);
            let durationB = getTotalSeconds(b.duration);
            return durationB - durationA;
        });
    }
    
    
    function getTotalSeconds(duration) {
        const [hours, minutes, seconds] = duration.split(' '); // Split by space
        const hoursNum = parseInt(hours.replace('hours', ''), 10); // Remove 'hours' text
        const minutesNum = parseInt(minutes.replace('min', ''), 10); // Remove 'min' text
        const secondsNum = parseInt(seconds.replace('sec', ''), 10); // Remove 'sec' text // 
        return hoursNum * 3600 + minutesNum * 60 + secondsNum; // Calculate total seconds
    }
    }
    error(error) {
        console.log(error)
    }
    
    
    
    
    
}


    customElements.define('modal-ctr', ModalDiv)
    customElements.define('fit-tracker', FitTracker)
    customElements.define('fit-main', FitMain)
    customElements.define('fit-header', FitHeader)
    customElements.define('fit-footer', FitFooter)
    customElements.define('fit-aside', FitAside) 
