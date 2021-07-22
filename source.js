// Slideshow image
var slideIndex = 0;
showSlides();

function showSlides () {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 2000);
}

// Open and Close - Buy Ticket
let buyBtns = document.querySelectorAll('.js-buy-ticket');
let modal = document.querySelector('.modal');
let modalClose = document.querySelector('.modal-close');

function openBuyTickets() {
    modal.classList.add('open');
}

function closeBuyTickets() {
    modal.classList.remove('open');
}

modalClose.addEventListener('click',closeBuyTickets);


for (let buyBtn of buyBtns) {
    buyBtn.addEventListener('click', openBuyTickets);
}

// Music Player
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

let heading = $('.dashboard-header h2')
let singerName = $('.dashboard-header p')
let cdThumb = $('.cd-thumb')
let audio = $('#audio')
let playBtn = $('.btn-toggle-play')
let player = $('.player')
let progress = $('#progress')
let nextBtn = $('.btn-next')
let prevBtn = $('.btn-prev')
let randomBtn = $('.btn-random')
let repeatBtn = $('.btn-repeat')
let playlist = $('.playlist')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "On The Ground",
            singer: "Rosé",
            path: "./assets/music/On The Ground - Rose.mp3",
            image: "./assets/song-img/ontheground.jpeg"
        },
        {
            name: "Save Your Tears Remix",
            singer: "The Weeknd ft. Ariana Grande",
            path: "./assets/music/Save Your Tears Remix_ - The Weeknd_ Ari.mp3",
            image: "./assets/song-img/saveyourtears.jpeg"
        },
        {
            name: "Hello Future",
            singer: "NCT Dream",
            path: "./assets/music/Hello Future - NCT Dream.mp3",
            image: "./assets/song-img/HelloFuture.jpeg"
        },
        {
            name: "Build a Bitch",
            singer: "Bella Poarch",
            path: "./assets/music/Build a Bitch.mp3",
            image: "./assets/song-img/build_a_bitch.png"
        },
        {
            name: "Có Hẹn Với Thanh Xuân",
            singer: "Monstar",
            path: "./assets/music/Co Hen Voi Thanh Xuan - Monstar.mp3",
            image: "./assets/song-img/monstar.jpeg"
        },
        {
            name: "Old Town Road",
            singer: "Lil Nas X",
            path: "./assets/music/Old Town Road.mp3",
            image: "./assets/song-img/old_town_road.png"
        },
        {
            name: "Sugar",
            singer: "Maroon 5",
            path: "./assets/music/Sugar.mp3",
            image: "./assets/song-img/sugar.png"
        },
        {
            name: "Without You",
            singer: "Avicii",
            path: "./assets/music/Without You.mp3",
            image: "./assets/song-img/without_you.png"
        },
    ],
    handleEvents: function() {
        // Play button
        playBtn.onclick = function () {
            if(app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        audio.onplay = function() {
            app.isPlaying = true;
            player.classList.add('playing')
        }

        audio.onpause = function() {
            app.isPlaying = false   ;
            player.classList.remove('playing')
        }
        //Progress bar
        audio.ontimeupdate = function() {
            if(audio.duration) {
                let progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent;
            }
        }

        // Seek
        progress.onchange = function () {
           let seekTime = audio.duration / 100 * progress.value
           audio.currentTime = seekTime
        }
        // Next songs
        nextBtn.onclick = function() {
            if(app.isRandom) {
                app.randomSongs()
            } else {
                app.nextSongs()
            }
            audio.play()
            app.render()
        }
        // Prev songs
        prevBtn.onclick = function() {
            if(app.isRandom) {
                app.randomSongs()
            } else {
                app.prevSongs()
            }
            audio.play()
        }
        // Random songs
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active', app.isRandom);
        }
        // When song end
        audio.onended = function() {
            if(app.isRepeat) {
                audio.play()
            } else {
            nextBtn.click()
        }
    }

        // Repeat a song
        repeatBtn.onclick = function() {
        app.isRepeat = !app.isRepeat
        repeatBtn.classList.toggle('active', app.isRepeat)
        }
        //Playlist click
        playlist.onclick = function (e) {
            //Process when click on Song
            let songSection = e.target.closest('.song:not(.active)')
            if(songSection) {
                app.currentIndex = songSection.dataset.index
                app.loadCurrentSong()
                audio.play()
            }
        }
    },
    nextSongs: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    prevSongs: function() {
        this.currentIndex--
        console.log(app.currentIndex)
        if (this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },
    randomSongs: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random()* this.songs.length);
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    render: function() {
        let html = this.songs.map((song, index) => {
            return `
            <div  class="song onclick="${app.getCurrentSong()}" ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>

                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                </div>
            </div>
        `
        })
        $('.playlist').innerHTML = html.join('')
    },

    loadCurrentSong: function() {

        heading.textContent = this.getCurrentSong().name
        singerName.textContent = this.getCurrentSong().singer
        cdThumb.style.backgroundImage = `url('${this.getCurrentSong().image}')`
        audio.src = this.getCurrentSong().path
    },

    getCurrentSong: function() {
        return app.songs[app.currentIndex]
    },

    start: function() {
        this.handleEvents();
        // render danh sach bai hat
        this.render();
        // Tai thong tin bai hat dau tien khi chay
        this.loadCurrentSong();
        // Lay thong tin bai hat
        this.getCurrentSong();
    }
}

app.start()

/*
1. Render songs
2. Play / pause / seek */
