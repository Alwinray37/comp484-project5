const locations = [
    {
        name: "bookstore",
        lat: 34.2078,
        lng: -118.4892
    },
    {
        name: "Matadome", 
        lat: 34.2072,
        lng: -118.4895
    }
];

let map;
let currentIndex = 0;
let score = 0;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 34.2078, lng: -118.4892 },
        zoom: 15
    });

    map.addListener("click", (event) => {
        const clickedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        checkLocation(clickedLocation);
    });
}

function checkLocation(clickedLocation) {
    const targetLocation = locations[currentIndex];
    const distance = getDistance(clickedLocation, targetLocation);

    if (distance < 50) { // 50 meters threshold
        score++;
        alert(`Correct! Your score is now ${score}.`);
        currentIndex++;
        if (currentIndex >= locations.length) {
            alert("Congratulations! You've found all locations.");
            currentIndex = 0; // Reset for a new game
            score = 0; // Reset score
        }
    } else {
        alert("Wrong location. Try again!");
    }
}

function getDistance(loc1, loc2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = loc1.lat * Math.PI / 180;
    const φ2 = loc2.lat * Math.PI / 180;
    const Δφ = (loc2.lat - loc1.lat) * Math.PI / 180;
    const Δλ = (loc2.lng - loc1.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}   
