
const songs = [
  {
    title: "Tauba Tauba",
    artist: "Karan Aujla, Vishal Mishra, Abhijeet Srivastava",
    src: "songs/Tauba Tauba.mp3",
    cover: "https://pagalworldmusic.com/downloads/cover/4567425/4567425.jpg"
  },
  {
    title: "ANTIDOTE",
    artist: "Karan Aujla",
    src: "songs/ANTIDOTE-320kbps.mp3",
    cover: "https://pagalworldmusic.com/downloads/cover/4567035/4567035.jpg"
  },
  {
    title: "Courtside",
    artist: "Karan Aujla",
    src: "songs/Courtside Original-320kbps.mp3",
    cover: "https://pagalworldmusic.com/downloads/cover/4572442/4572442.jpg"
  },
  {
    title: "ON TOP 2",
    artist: "Karan Aujla, Yeah Proof",
    src: "songs/ON TOP 2-320kbps.mp3",
    cover: "https://pagalworldmusic.com/downloads/cover/4566618/4566618.jpg"
  }

];
// === DOM Elements ===

const cardContainer = document.querySelector(".card-grid");
const audio = document.getElementById("audioPlayer");
const coverImg = document.querySelector(".cover-img");
const songTitle = document.querySelector(".song-title");
const artistName = document.querySelector(".artist-name");
const playPauseBtn = document.getElementById("playPauseBtn");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volumeSlider");
const volumeIcon = document.querySelector(".volume-control-icon");
let currentSongIndex = 0;
let isPlaying = false;

window.addEventListener("load", () => {
  audio.volume = 1;
  volumeSlider.value = 1;
  updateVolumeSliderColor(1);

  progressBar.value = 0;
  updateProgressBarColor(0);
});


//  function to load all the music card dynamically in html. 
function loadSongs() {
  cardContainer.innerHTML = ""; // remove all card if hardcoded in html.
  songs.forEach((song, index) => {
    const card = document.createElement("div");
    card.className = "music-card";
    card.setAttribute("data-index", index); // add index for click tracking . to get details about which song is clicked by the user 
    card.innerHTML = `
        <div class="card-img">
        <img src="${song.cover}" alt="${song.title}" />
        <div class="play-icon">
        <i class="ri-play-large-fill"></i>
        </div>
        </div>
        <h3 class="card-title">${song.title}</h3>
        <p class="card-subtitle">${song.artist}</p>
        `;

    cardContainer.appendChild(card);
  });
}

loadSongs(); // calling the loadsongs function on the load of the website .


// handling the click on the music-cards
cardContainer.addEventListener("click", (e) => {
  const card = e.target.closest(".music-card");
  if (!card) return;
  const index = card.getAttribute("data-index");
 
  // Now load song.src into your audio player
  loadSong(index)
});

// to be noted the previous loadssongs function runs on the loading of the webpage but this loadsong function runs every time the user click on the songs card it updates the song.src,title,or cover in the player-bar .
function loadSong(index) {
  const song = songs[index];
  songTitle.textContent = song.title;
  artistName.textContent = song.artist;
  coverImg.src = song.cover;
  audio.src = song.src;

  currentSongIndex = index;
  audio.play();
  isPlaying = true;

  updatePlayPauseIcon();
}


// function to toggle the buttons of play and pause 
function togglePlayPause() {
  if (!audio.src) {
  loadSong(0); 
  return;
}
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  } else {
    audio.play();
    isPlaying = true;
  }
  updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
  const icon = playPauseBtn.querySelector("i");
  if (isPlaying) {
    icon.classList.remove("ri-play-large-fill");
    icon.classList.add("ri-pause-line");
  } else {
    icon.classList.remove("ri-pause-line");
    icon.classList.add("ri-play-large-fill");
  }
}

// adding click event to the playpause btn and runnign the toglle playppause function so if the song is playing and user clicked on the plapause btn then the audio is paused and the isplaying is changed to false vice-versa 
playPauseBtn.addEventListener("click", togglePlayPause);

// function to play the next song and if there is no next song then it moves to the first song 
function playNext() {
  if (currentSongIndex < songs.length - 1) {
    currentSongIndex++;
  } else {
    currentSongIndex = 0; // go back to first song
  }
  loadSong(currentSongIndex);
}

// function to play the previous song and if there is no previous song then it moves to the last  song 

function playPrevious() {
  if (currentSongIndex > 0) {
    currentSongIndex--;
  } else {
    currentSongIndex = songs.length - 1; // go to last song
  }
  loadSong(currentSongIndex);
}



// adding event listeners to next and previous music buttons

document.getElementById("nextBtn").addEventListener("click", playNext);
document.getElementById("prevBtn").addEventListener("click", playPrevious);


// function for the update the time and current time of the audio 
audio.addEventListener("timeupdate", updateProgress);

function updateProgress() {
  const current = audio.currentTime;
  const total = audio.duration;

  // Set progress bar
  progressBar.value = current;
  progressBar.max = total;

  // Update timestamps
  currentTimeEl.textContent = formatTime(current);
  durationEl.textContent = formatTime(total);
  
  updateProgressBarColor(audio.currentTime)

}
function updateProgressBarColor(value) {
  const percent = (value / progressBar.max) * 100;
  progressBar.style.background = `linear-gradient(to right, #1ED760 ${percent}%, #ccc ${percent}%)`;
}

// format time helper function to format the uneven time like if less than 10 or so add 0 in the beggining 
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}


// change the time if user increase or decrease the value of the proress bar 
progressBar.addEventListener("input", () => {
  audio.currentTime = progressBar.value;
});

// volume controller 
volumeSlider.addEventListener("input", (e) => {
  const volumeSlideValue = Number(volumeSlider.value);
  audio.volume = volumeSlideValue;
  toggleVolumeIcon(volumeSlideValue > 0);
  volumeSlider.style.background = `linear-gradient(to right, #1ED760 ${volumeSlideValue * 100}%, #ccc ${volumeSlideValue * 100}%)`;
});


// toggle of volume mute unmute if someone click on the volume icon
volumeIcon.addEventListener("click", () => {
  if (audio.volume === 0) {
    audio.volume = 1;
    volumeSlider.value = 1;
    toggleVolumeIcon(true);
  } else {
    audio.volume = 0;
    volumeSlider.value = 0;
    toggleVolumeIcon(false);
  }
  updateVolumeSliderColor(volumeSlider.value);
});


function toggleVolumeIcon(condition) {
  volumeIcon.innerHTML = condition ? ` <i class="fa-solid fa-volume-high"></i>` : `<i class="fa-solid fa-volume-xmark"></i>`;
}

function updateVolumeSliderColor(value) {
  volumeSlider.style.background = `linear-gradient(to right, #1ED760 ${value * 100}%, #ccc ${value * 100}%)`;
}
