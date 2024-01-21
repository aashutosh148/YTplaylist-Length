
function extractPlaylistId() {
    url = document.querySelector('input').value;
    const regex = /list=([^&]+)/;
    const match = url.match(regex);

    if (match && match[1]) {
        return match[1];
    } else {
        return null; // If no match is found
    }
}

async function fetchVideos() {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ''}&key=${apiKey}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`An HTTP error ${response.status} occurred:\n${JSON.stringify(errorData)}`);
        }

        const playlistItemsResponse = await response.json();

        // Extract videos and count them
        const videos = playlistItemsResponse.items;
        totalVideos += videos.length;

        // Calculate total duration
        videos.forEach(video => {
            allVideoId.push(video.contentDetails.videoId);
        });

        // Check for next page
        nextPageToken = playlistItemsResponse.nextPageToken;

        if (nextPageToken) {
            // Recursively fetch next page
            await fetchVideos();
        }
    } catch (error) {
        console.error(error.message);
    }
}


function chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

function parseISO8601Duration(durationString) {
    const durationRegex = /^P(?:([\d.]+Y)?(?:([\d.]+M))?(?:([\d.]+D))?T?(?:([\d.]+H))? ?(?:([\d.]+M))? ?(?:([\d.]+S))?)?$/;

    const matches = durationString.match(durationRegex);
    if (!matches) {
        throw new Error('Invalid ISO 8601 duration format');
    }

    const [, years, months, days, hours, minutes, seconds] = matches.map(match => parseFloat(match) || 0);

    const totalSeconds = (
        (years * 365 * 24 * 60 * 60) +
        (months * 30 * 24 * 60 * 60) +
        (days * 24 * 60 * 60) +
        (hours * 60 * 60) +
        (minutes * 60) +
        seconds
    );

    return totalSeconds;
}


async function fetchVideoDurations(videoIds) {
    let totalVideos = 0;
    let totalDurationInSeconds = 0;
    try {
        // Join video IDs into a comma-separated string (up to 50 IDs per request)
        const videoIdChunks = chunkArray(videoIds, 50); // Split into chunks of 50 if needed

        for (const videoIdChunk of videoIdChunks) {
            const videoIdString = videoIdChunk.join(',');

            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIdString}&key=${apiKey}`);

            // Parse the response to access data
            const videosData = await response.json();

            if (!response.ok) {
                // Log detailed error information for debugging
                console.error(error.message, error.stack);
                throw new Error(`An HTTP error ${response.status} occurred:\n${JSON.stringify(videosData)}`);
            }

            // Process video durations
            for (const video of videosData.items) {
                totalVideos++;
                const duration = video.contentDetails.duration;
                totalDurationInSeconds += parseISO8601Duration(duration);
            }
            // console.log(totalDurationInSeconds);
        }
        return { totalVideos, totalDurationInSeconds };

        // Additional calculations or actions with totalDurationInSeconds
    } catch (error) {
        console.error(error.message);
    }
}

function formatDuration(totalDurationInSeconds) {
    const days = Math.floor(totalDurationInSeconds / 86400);
    const hours = Math.floor((totalDurationInSeconds % 86400) / 3600);
    const minutes = Math.floor((totalDurationInSeconds % 3600) / 60);
    const seconds = Math.floor(totalDurationInSeconds % 60);

    // Ensure values are within the specified range
    const formattedDuration = {
        days: Math.max(0, days),
        hours: Math.max(0, Math.min(23, hours)),
        minutes: Math.max(0, Math.min(59, minutes)),
        seconds: Math.max(0, Math.min(59, seconds)),
    };
    formattedDuration.totalDurationInSeconds = totalDurationInSeconds;

    return formattedDuration;
}

function calculateAdjustedDuration(totalDurationInSeconds, speed) {
    const adjustedDurationInSeconds = totalDurationInSeconds / speed;
    return formatDuration(adjustedDurationInSeconds);
}