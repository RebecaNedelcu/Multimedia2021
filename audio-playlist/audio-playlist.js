"use strict";

const app = {
  audio: null,
  tracks: [], //track list
  currentUrl: null,
  //UI
  currentTime: null,
  duration: null,
  btnPlayPause: null,
};

/** Plays a song
 * @param {string} url - The url of the song
 */
app.play = function (url) {
  const elements = document.querySelectorAll("#playlist li.active");
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.remove("active");
  }

  const selectedElement = document.querySelector(
    '#playlist li[data-url="' + url + '"]'
  );
  selectedElement.classList.add("active");

  app.currentUrl = url;
  app.audio.src = app.currentUrl;
  app.audio.load();
  app.audio.play();
  const img = document.querySelector("#poza");
  if (selectedElement.getAttribute("cover_art_url")) {
    img.width = 200;
    img.height = 200;
    img.src = selectedElement.getAttribute("cover_art_url");
  } else {
    img.width = 0;
    img.height = 0;
    img.src = "";
  }
};w

/** Changes the current song */
app.next = function () {
  let index = app.tracks.indexOf(app.currentUrl) + 1;
  if (index >= app.tracks.length) {
    index = 0;
  }

  app.play(app.tracks[index]);
};

app.load = async function () {
  app.audio = document.getElementById("audio");
  app.currentTime = document.querySelector("#currentTime");
  app.duration = document.querySelector("#duration");
  app.btnPlayPause = document.getElementById("btnPlayPause");
  const playlist = document.querySelector("#playlist");

  const response = await fetch("songs.json");
  const data = await response.json();
  console.log(data);
  data.songs.forEach((song) => {
    let li = document.createElement("li");
    li.setAttribute("data-url", song.url);
    li.setAttribute("cover_art_url", song.cover_art_url);
    li.classList.add("list-group-item");
    li.innerHTML = song.name;
    playlist.appendChild(li);
  });

  const volume = document.querySelector("#volum");

  volume.addEventListener("change", () => {
    app.audio.volume = volume.value / 100;
  });

  let songName = localStorage.getItem("song");
  let time = localStorage.getItem("time");
  app.audio.setAttribute("src", songName);
  app.audio.currentTime = time;

  // Iterate over the playlist in order to associate events
  const elements = document.querySelectorAll("#playlist li");
  for (let i = 0; i < elements.length; i++) {
    const url = elements[i].dataset.url;
    app.tracks.push(url);

    elements[i].addEventListener("click", function () {
      app.play(this.dataset.url);
    });
  }

  // Handle the timeupdate event
  app.audio.addEventListener("durationchange", function () {
    app.duration.textContent = app.secondsToString(app.audio.duration);
  });

  let timp=document.getElementById("timp");
  
  app.audio.addEventListener("timeupdate", function () {
    const currentTime = app.audio.currentTime;

    if (app.audio.duration) {
      app.currentTime.textContent = app.secondsToString(currentTime);
      timp.value=app.audio.currentTime/app.audio.duration*100;
      timp.oninput=function(){
        app.audio.currentTime=(app.audio.duration*this.value)/100;
      }
    } else {
      //innerText can also be used
      //differences https://www.w3schools.com/jsref/prop_html_innerhtml.asp
      app.currentTime.textContent = "...";
    }
  });

  // Handle the play event
  app.audio.addEventListener("play", function () {
    //alternative: app.btnPlayPause.children[0].classList.replace('fa-play', 'fa-pause');
    app.btnPlayPause.children[0].classList.remove("fa-play");
    app.btnPlayPause.children[0].classList.add("fa-pause");
  });

  // Handle the pause event
  app.audio.addEventListener("pause", function () {
    app.btnPlayPause.children[0].classList.add("fa-play");
    app.btnPlayPause.children[0].classList.remove("fa-pause");
    // save to local storage
    localStorage.setItem("song", audio.src);
    localStorage.setItem("time", audio.currentTime);
  });

  // Handle the ended event
  app.audio.addEventListener("ended", app.next);

  // Handle the click event btnPlayPause
  document
    .getElementById("btnPlayPause")
    .addEventListener("click", function () {
      if (app.audio.src === "") {
        app.play(app.tracks[0]);
      } else {
        if (app.audio.paused) {
          app.audio.play();
        } else {
          app.audio.pause();
        }
      }
    });

  // Handle the click event on btnForward
  document.getElementById("btnForward").addEventListener("click", function () {
    app.audio.currentTime += 10;
  });

  // Handle the click event on btnNext
  document.getElementById("btnNext").addEventListener("click", app.next);
};

/**
 * A utility function for converting a time in miliseconds to a readable time of minutes and seconds.
 * @param {number} seconds The time in seconds.
 * @return {string} The time in minutes and/or seconds.
 **/
app.secondsToString = function (seconds) {
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds % 60);

  min = min >= 10 ? min : "0" + min;
  sec = sec >= 10 ? sec : "0" + sec;

  const time = min + ":" + sec;

  return time;
};
