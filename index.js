
let playlistId = '';
document.write('<script type="text/javascript" src="assets/js/apiKey.js"></script>');
document.write('<script type="text/javascript" src="assets/js/videoUtils.js"></script>');

// Initialize counters and variables
let totalVideos = 0;
let nextPageToken = null;
const allVideoId = [];

function toggleDarkMode() {
    const body = document.body;
    const currentBackgroundColor = window.getComputedStyle(body).backgroundColor;

    // Convert RGB to hex
    function rgbToHex(rgb) {
        let hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = '0' + hex;
        }
        return hex;
    }

    function fullColorHex(rgb) {
        const splitRgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return '#' + rgbToHex(splitRgb[1]) + rgbToHex(splitRgb[2]) + rgbToHex(splitRgb[3]);
    }

    const currentHexColor = fullColorHex(currentBackgroundColor);

    if (currentHexColor === '#f8f9fa') {
        body.style.backgroundColor = '#212529';
        body.style.color = '#fff';
        document.querySelector(".dark-mode-btn").textContent = 'Light Mode';
    } else {
        body.style.backgroundColor = '#f8f9fa';
        body.style.color = '#2a2d2d';
        document.querySelector(".dark-mode-btn").textContent = 'Dark Mode';
    }
}



// Execute the async function
document.getElementById('calculate').addEventListener('click', async function () {
    playlistId = extractPlaylistId();
    await fetchVideos();

    const { totalVideos, totalDurationInSeconds } = await fetchVideoDurations(allVideoId);

    const formattedDuration = formatDuration(totalDurationInSeconds);
    

    const speed1_25x = 1.25;
    const speed1_5x = 1.5;
    const speed1_75x = 1.75;
    const speed2x = 2.0;

    const avg = formatDuration(totalDurationInSeconds/totalVideos);
    const adjusted1_25x = calculateAdjustedDuration(totalDurationInSeconds, speed1_25x);
    const adjusted1_5x = calculateAdjustedDuration(totalDurationInSeconds, speed1_5x);
    const adjusted1_75x = calculateAdjustedDuration(totalDurationInSeconds, speed1_75x);
    const adjusted2x = calculateAdjustedDuration(totalDurationInSeconds, speed2x);


    function formatResult(duration) {
        return `${duration.days > 0 ? `${duration.days} days, ` : ''}${duration.hours > 0 ? `${duration.hours} hours, ` : ''}${duration.minutes > 0 ? `${duration.minutes} minutes, ` : ''}${duration.seconds > 0 ? `${duration.seconds} seconds` : ''}`;
    }

    // Display the results on the webpage
    document.getElementById('result').innerHTML = `
        <p>No of videos : ${totalVideos}</p>
        <p>Average length of video : ${formatResult(avg)}</p>
        <p>Total length of playlist : ${formatResult(formattedDuration)}</p>
        <p>At 1.25x : ${formatResult(adjusted1_25x)}</p>
        <p>At 1.50x : ${formatResult(adjusted1_5x)}</p>
        <p>At 1.75x : ${formatResult(adjusted1_75x)}</p>
        <p>At 2.00x : ${formatResult(adjusted2x)}</p>
    `;



});






