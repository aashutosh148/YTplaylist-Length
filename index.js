
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
        body.style.color = '#333';
        document.querySelector(".dark-mode-btn").textContent = 'Dark Mode';
    }
}



// Execute the async function
document.getElementById('calculate').addEventListener('click', async function () {
    playlistId = extractPlaylistId();
    await fetchVideos();

    const { totalVideos, totalDurationInSeconds } = await fetchVideoDurations(allVideoId);

    const formattedDuration = formatDuration(totalDurationInSeconds);
    console.log(`Total videos in the playlist: ${totalVideos}`);
    // console.log(`Total duration of all videos: ${formattedDuration}`);
    formattedDuration.totalDurationInSeconds = totalDurationInSeconds;
    console.log(formattedDuration);
});






