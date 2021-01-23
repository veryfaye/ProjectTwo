/**
 * This script will add a div to the beginning of the body and that will fill
 * the background with a fixed starfield of randomly placed dots.
 * It requires that you DO NOT already have a div with the class of "stars"
 * in your document.
 */

const SA = {};
SA.density = 10000; //set star density: lower number = more stars
SA.starCoord = []; //array to hold x,y for stars
SA.starString = ""; //string to drop into css

SA.getRandomNum = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

SA.listStars = function() {
  //creates the coordinate list
  for (let i = 0; i < SA.starCount; i++) {
    const x = SA.getRandomNum(0, SA.w);
    const y = SA.getRandomNum(0, SA.h);
    const s = [x, y];
    SA.starCoord.push(s);
  }
};

SA.makeStarString = function() {
  //creates the css string to draw the stars
  SA.listStars();
  for (let i = 0; i < SA.starCoord.length; i++) {
    SA.starString +=
      "radial-gradient(2px 2px at " +
      SA.starCoord[i][0] +
      "px " +
      SA.starCoord[i][1] +
      "px, #888, rgba(0,0,0,0))"; //css star size and color
    if (i != SA.starCoord.length - 1) {
      SA.starString += ", ";
    }
  }
};

SA.fillSky = function() {
  SA.w = window.innerWidth > 0 ? window.innerWidth * 3 : screen.width * 3;
  SA.h = $(document).height();
  SA.starCount = Math.round((SA.h * SA.w) / SA.density);
  SA.makeStarString();
  $("body").prepend('<div class="stars"></div>'); //create a div to hold the stars change this class name or comment it out if you already have a ".stars" div
  $(".stars").css({
    position: "fixed",
    "z-index": "-1",
    height: "100%",
    width: "100%",
    background: "#1f1f1f",
    overflow: "hidden",
    "background-image": SA.starString
  });
};

$(function () {
    SA.fillSky();
    $(".menu-toggle")
      .add(".menu a")
      .click(() => {
        $(".menu").toggleClass("active");
        $(".menu-btn").toggleClass("active");
        $(".close-btn").toggleClass("active");
      });
    $("a[href*=#]:not([href=#])").click(function () {
      if (
        // eslint-disable-next-line eqeqeq
        location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
        // eslint-disable-next-line eqeqeq
        location.hostname == this.hostname) {
        let target = $(this.hash);
        target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          $("html,body").animate(
            {
              scrollTop: target.offset().top
            },
            1000
          );
          return false;
        }
      }
    });
    $(".browsehappy").click(function () {
      $(this).slideUp();
    });
  });
