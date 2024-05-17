console.log("Shubham");
let currentsong = new Audio();
let play = document.getElementById("play");
let songs;
let currentFolder
async function getSongs(folder) {
    currentFolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    console.log(as);
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    // songUL.innerHTML = ""
    let songsHTML = "";
    for (const song of songs) {
        songsHTML += `<li> <img class="musicicon " src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw-ijNSyUcbEwabUWxsuVSooaBbwwLyIijHtpIqQsa7A&s" alt="">
                            <div class="info">
                                <div> ${song.replace(/%20/g, " ")}</div>
                                <div>Artist</div>
                            </div>
                            <img class="playnow invert" src="https://e7.pngegg.com/pngimages/170/341/png-clipart-computer-icons-encapsulated-postscript-play-now-button-angle-text-thumbnail.png" alt="">
        </li>`;
    }

    songUL.innerHTML = songsHTML;

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", () => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });

}

const playmusic = (track) => {
    currentsong.src = `/${currentFolder}/` + track;

    currentsong.play();


    play.innerHTML = '<i class="fas fa-pause"></i>'; // Change to pause icon
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    document.querySelector(".songinfo").innerHTML = decodeURI(track);

    
};


    //displaying the albums
    // -----------------------------------
    async function displayAlbums() {
        let a = await fetch(`http://127.0.0.1:5500/songs/`);
        let response = await a.text();
        
        let div = document.createElement("div");
        div.innerHTML = response;
        
        let anchor = div.getElementsByTagName("a");
        let folders = [];
    
        for (let e of anchor) {
            // ...
            let slicedHref = e.href.split("/songs")[1];
            let folderName = slicedHref.split("/")[1];
            let infoUrl = `http://127.0.0.1:5500/songs/${folderName}/info.json`;
    
            try {
                let infoResponse = await fetch(infoUrl);
                if (infoResponse.ok) {
                    let infoData = await infoResponse.json();
                    console.log(infoData);
                } else {
                    console.error(`Failed to fetch ${infoUrl}: ${infoResponse.status} ${infoResponse.statusText}`);
                }
            } catch (error) {
                console.error(`Error fetching ${infoUrl}: ${error.message}`);
            }
            // ...
        }
    
        console.log("Folders:", folders);
    }
    
    
// -------------------------------

async function main() {
    await getSongs("songs/English");
    console.log(songs);
    playmusic(songs[6], true)

    //display all the albums
    displayAlbums()
    
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.innerHTML = '<i class="fas fa-pause"></i>'; // Change to pause icon
        } else {
            currentsong.pause();
            play.innerHTML = '<i class="fas fa-play"></i>'; // Change to play icon
        }
    });


    // calculating the time
    function secondsToMinutesSeconds(seconds) {
        if(isNaN(seconds)|| seconds < 0){
            return "00:00"
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }



    //time update event
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`;
        // document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration) * 100 + "%";
    })
    //time update event
    currentsong.addEventListener("timeupdate", () => {
        const currentTime = currentsong.currentTime;
        const duration = currentsong.duration;

        const percentage = (currentTime / duration) * 100;

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentTime)} / ${secondsToMinutesSeconds(duration)}`;
        document.querySelector(".circle").style.left = `${percentage}%`;
    });


    // event listner seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = (currentsong.duration) * percent / 100
    })

    //    event listner for HAMBURGER
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // exit from the hamburger
     document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

    // event listner previous
    previous.addEventListener("click",() => {
        console.log("previous click");
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs,index);
        if(index-1 >= 0){
            playmusic(songs[index-1])
        }
       
    })

    // and next
    next.addEventListener("click",() => {
        console.log("Next click");
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs,index);
        if(index+1 < songs.length){
            playmusic(songs[index+1])
        }
       
    })

    // volume change
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("input",(e)=>{
        console.log(e,e.target,e.target.value);
        currentsong.volume = parseInt(e.target.value)/100
    })

    //Load the playlist------------------->
    // Array.from(document.getElementsByClassName("cards")).forEach(e=>{
    //     e.addEventListener("click",async item=>{
    //         songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    //         console.log(item,item.currentTarget.dataset);
           
    //     })
    // })

    Array.from(document.getElementsByClassName("cards")).forEach(e => {
        e.addEventListener("click", async item => {
            if (item.currentTarget) {
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            }
        });
    });
    
    // -----------------------------

    // --------------------------------
    // Add this code inside your main() function after the song list is populated

Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((li) => {
    li.addEventListener("mouseenter", () => {
        li.classList.add("song-hovered");
    });

    li.addEventListener("mouseleave", () => {
        li.classList.remove("song-hovered");
    });
});

// -------------------------------
// Add this code inside your main() function after the displayAlbums() function

function isMobile() {
    return window.innerWidth <= 768; // Adjust the threshold as needed
}

Array.from(document.getElementsByClassName("cards")).forEach(e => {
    e.addEventListener("click", async item => {
        if (item.currentTarget) {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            if (isMobile()) {
                // Open the hamburger menu on mobile devices
                document.querySelector(".left").style.left = "0";
            }
        }
    });
});


}


main();

