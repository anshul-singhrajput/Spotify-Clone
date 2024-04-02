let currentSong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    // Ensure input is a non-negative number
    seconds = Math.max(0, seconds);

    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format the result with leading zeros
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    //show all the songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
          
     
          <img class="invert" src="images/music.svg" alt="music logo">
          <div class="info">
              <div> ${song.replaceAll("%20", " ")}</div>
              <div>Anshul</div>
          </div>
          <div class="playNow">
              <span>Play Now</span>
              <img class="invert" src="images/play.svg" alt="play button logo">
          </div> 
         
         </li>`;
    }

     // Attach an eventListner to each Song
     Array.from(document.querySelector(".songList").getElementsByTagName('li')).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs;
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/Songs/" + track)

    currentSong.src = `/${currfolder}/` + track
    if (!pause) {

        currentSong.play()
        play.src = "images/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"



}

async function displayAlbums() {
    let a = await fetch(`/Songs/`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        console.log(e);
        if (e.href.includes("/Songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/Songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + `  <div data-folder="${folder}" class="card ">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" class="injected-svg" data-src="/icons/play-stroke-sharp.svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" role="img" color="#000000">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#000000" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round"></path>
                </svg>
            </div>
            <img src="Songs/${folder}/card1.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }

    //load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("fetching songs")
            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        })
    })
}

async function main() {

    // Get the list of all songs
    await getSongs("Songs/mmc");
    playMusic(songs[0], true)

    //Display all the albums on the page
    await displayAlbums()

    // Attach an eventListner to play , next , previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "images/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "images/play.svg"
        }
    })

    //Listen for Timeupdate Event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)}/
        ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left
            = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // Add an event Listner to seekbar 
    document.querySelector(".seekbar").addEventListener("click", e => {
        let persent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = persent + "%"
        currentSong.currentTime = ((currentSong.duration) * persent) / 100
    })

    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })


    //Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //Add an event listner to previous
    previous.addEventListener("click", () => {
        console.log("Previous Clicked")
        console.log(currentSong)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs, index);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1])
        }

    })

    //Add an event listner to next
    next.addEventListener("click", () => {
        console.log("next Clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs, index);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    })

    //Add an event to Volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to ", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if(currentSong.volume >0){
            document.querySelector(".volume img").src =  document.querySelector(".volume img").src.replace( "mute.svg" , "volume.svg")
        }
    })

    //Add Event listner to mute the volume
    document.querySelector(".volume img").addEventListener("click" , e=> {
        console.log(e.target);
        if(e.target.src.includes("volume.svg")){
            e.target.src =  e.target.src.replace("volume.svg" , "mute.svg") 
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace( "mute.svg" , "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })




}

main();