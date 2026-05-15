const locations = [
    { name: "Bookstore",          bounds: { north: 34.237807566902255, south: 34.23694583854509,  east: -118.52758043963443, west: -118.52881178472619 } },
    { name: "Orange Grove",       bounds: { north: 34.23726072900246,  south: 34.235624857538895, east: -118.52476406755366, west: -118.5272812552377  } },
    { name: "Bayramian Hall",     bounds: { north: 34.24088361779897,  south: 34.23976466975573,  east: -118.53011723674155, west: -118.5316030406463  } },
    { name: "Student Rec Center", bounds: { north: 34.240606045091575, south: 34.23931814062795,  east: -118.52470901278596, west: -118.5251918239382  } },
    { name: "Matadome",           bounds: { north: 34.2426623954652,   south: 34.241004453037,    east: -118.52529263044259, west: -118.52724292638787 } }
];


let map;
let currentIndex = 0;
let questionItem = document.createElement("div");
let score = 0;
const button = document.querySelector("button");
const rectangles = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 34.240116803442746, lng: -118.52874287140531 },
        zoom: 17,
        disableDoubleClickZoom: true,
        styles: [
            { featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }] }
        ]
    });

    map.addListener("dblclick", (event) => {
        const clickedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        checkLocation(clickedLocation);
    });

    updateHighScoreDisplay();
    showQuestion();
}

// check if clicked location is within the given radius of the question location
// if yes, toggle correct class, append new question item, 
// if not, toggle wrong class, append new question item, 
function checkLocation(clickedLocation) {
    const location = locations[currentIndex];
    const bounds = location.bounds;

    const within = clickedLocation.lat >= bounds.south &&
                   clickedLocation.lat <= bounds.north &&
                   clickedLocation.lng >= bounds.west &&
                   clickedLocation.lng <= bounds.east;

    // draw rectangle when user clicks, green if correct, red if wrong
    const rect = new google.maps.Rectangle({
        bounds: bounds,
        fillColor: within ? "green" : "red",
        fillOpacity: 0.4,
        strokeColor: within ? "green" : "red",
        strokeWeight: 2,
        map: map
    });
    rectangles.push(rect);

    // update notification
    document.querySelector(".notification-container").textContent =
        within ? "Your answer is correct!!" : "Sorry, wrong location.";

    // mark current question div correct/incorrect
    const questions = document.querySelectorAll(".question");
    questions[currentIndex].classList.add(within ? "correct" : "incorrect");

    if (within) score++;
    currentIndex++;

    if (currentIndex < locations.length) {
        showQuestion();
    } else {
        document.querySelector(".notification-container").textContent = `Game over! ${score} correct, ${locations.length - score} incorrect.`;

        button.classList.toggle("hidden");
        
        const best = localStorage.getItem("highScore") || 0;
        if (score > best) {
            localStorage.setItem("highScore", score);
            updateHighScoreDisplay();
        }
    }
}

// displays new location item in the quiz container
function showQuestion() {
    const location = locations[currentIndex];
    const quizContainer = document.querySelector(".quiz-container");
    let questionItem = document.createElement("div");
    questionItem.className = "question";
    questionItem.textContent = location.name;
    quizContainer.appendChild(questionItem);
}

function updateHighScoreDisplay() {
    const best = localStorage.getItem("highScore") || 0;
    document.getElementById("high-score").textContent = `High Score: ${best} / ${locations.length}`;
}

function resetGame() {
    currentIndex = 0;
    score = 0;
    document.querySelector(".quiz-container").innerHTML = "";
    document.querySelector(".notification-container").textContent = "";
    button.classList.add("hidden");
    rectangles.forEach(rect => rect.setMap(null));
    rectangles = [];
    
    updateHighScoreDisplay();
    showQuestion();
}