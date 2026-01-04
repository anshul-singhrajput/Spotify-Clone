// ================= GLOBALS =================
let currentSong = new Audio();
let songs = [];
let currFolder = "";

const play = document.getElementById("play");
const previous = document.getElementById("previous");
const next = document.getElementById("next");


// ================= UTIL =================
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

// ================= SONG DATA =================
// FRONTEND-ONLY → SONGS MUST BE DECLARED MANUALLY
const albums = {
  mmc: {
    title: "My Music Collection",
    description: "English Songs",
    artist: "Anshul",
    cover: "songs/mmc/card1.jpg",
    songs: [
      "01 - Counting Stars.mp3",
      "1 - Starboy - Starboy [SongsBling.com].mp3",
      "04-bruno-mars-thats-what-i-like.mp3",
      "06 Shake It Off.mp3",
      "006 - Mirrors - Justin Timberlake.mp3",
      "Laila Main Laila (Raees)-(DjBoss.Mobi).mp3"
    ]
  },
   music: {
    title: "Just Music",
    description: "Mix Songs",
    artist: "Anshul",
    cover: "songs/music/card2.jpg",
    songs: [
      "Khuda-Bhi_(webmusic.in).mp3",
      "Main Tere Ishq Me Gumarah Hua (Teraa Suroor) Movie Ringtone-1.mp3",
      "Mashooqana_@Gurudev.mp3"
    ]
  }

};

// ================= LOAD SONGS =================
function loadSongs(folder) {
  currFolder = folder;
  songs = albums[folder].songs;

  const songUL = document.querySelector(".songList ul");
  songUL.innerHTML = "";

  songs.forEach(song => {
    songUL.innerHTML += `
      <li>
        <img class="invert" src="images/music.svg">
        <div class="info">
          <div>${song}</div>
          <div>${albums[folder].artist}</div>
        </div>
        <div class="playNow">
          <span>Play Now</span>
          <img class="invert" src="images/play.svg">
        </div>
      </li>
    `;
  });

  Array.from(songUL.children).forEach(li => {
    li.addEventListener("click", () => {
      const track = li.querySelector(".info div").innerText.trim();
      playMusic(track);
    });
  });
}


function displayAlbums() {
  const cardContainer = document.querySelector(".cardContainer");
  cardContainer.innerHTML = "";

  for (const folder in albums) {
    const album = albums[folder];

    cardContainer.innerHTML += `
      <div class="card" data-folder="${folder}">
        <div class="play">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none">
            <path d="M5 20V4L19 12L5 20Z"
              fill="#000"></path>
          </svg>
        </div>
        <img src="${album.cover}" alt="${album.title}">
        <h2>${album.title}</h2>
        <p>${album.description}</p>
      </div>
    `;
  }

  // Card click → load songs
  Array.from(document.getElementsByClassName("card")).forEach(card => {
    card.addEventListener("click", () => {
      const folder = card.dataset.folder;
      loadSongs(folder);
      playMusic(albums[folder].songs[0]);
    });
  });
}


// ================= PLAY MUSIC =================
function playMusic(track, pause = false) {
  currentSong.src = `songs/${currFolder}/${track}`;

  if (!pause) {
    currentSong.play();
    play.src = "images/pause.svg";
  }

  document.querySelector(".songinfo").innerText = track;
  document.querySelector(".songTime").innerText = "00:00 / 00:00";
}

// ================= MAIN =================
function main() {
  // Load default album
  loadSongs("mmc");
  playMusic(songs[0], true);
  displayAlbums();

  // Play / Pause
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "images/pause.svg";
    } else {
      currentSong.pause();
      play.src = "images/play.svg";
    }
  });

  // Time update
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerText =
      `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;

    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Seekbar
  document.querySelector(".seekbar").addEventListener("click", e => {
    const percent =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    currentSong.currentTime = (currentSong.duration * percent) / 100;
    document.querySelector(".circle").style.left = percent + "%";
  });

  // Previous
  previous.addEventListener("click", () => {
    let index = songs.indexOf(
      decodeURIComponent(currentSong.src.split("/").pop())
    );
    if (index > 0) playMusic(songs[index - 1]);
  });

  // Next
  next.addEventListener("click", () => {
    let index = songs.indexOf(
      decodeURIComponent(currentSong.src.split("/").pop())
    );
    if (index < songs.length - 1) playMusic(songs[index + 1]);
  });

  // Volume
  document
    .querySelector(".range input")
    .addEventListener("change", e => {
      currentSong.volume = e.target.value / 100;
    });

  // Mute
  document.querySelector(".volume img").addEventListener("click", e => {
    if (currentSong.volume > 0) {
      currentSong.volume = 0;
      e.target.src = "images/mute.svg";
    } else {
      currentSong.volume = 0.1;
      e.target.src = "images/volume.svg";
    }
  });

  // Hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
}

main();
