let cards = [
    "fa-diamond",
    "fa-paper-plane-o",
    "fa-anchor",
    "fa-bolt",
    "fa-cube",
    "fa-anchor",
    "fa-leaf",
    "fa-bicycle",
    "fa-diamond",
    "fa-bomb",
    "fa-leaf",
    "fa-bomb",
    "fa-bolt",
    "fa-bicycle",
    "fa-paper-plane-o",
    "fa-cube"
];

// Game state variables
let firstCard,
    firstCardIcon,
    timerView,
    timer,
    totalTime,
    moves,
    firstCardSelected,
    matchCount,
    starRating;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Create each card's html, closed initially
function createDeckFrom(cards) {
    for (let i = 0; i < cards.length; i++) {
        $("#cards").append("<li class='card'><i class='fa " + cards[i] + "'></i></li>");
    }

}

// update user moves and stars
function updateScore() {
    // Update moves
    $(".moves").text(moves);

    let all_stars = $(".stars");
    if ((moves > 12) && (moves <= 16)) {
        starRating = 2;
        all_stars.children().remove("li");
        all_stars.append("<li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star-o'></i></li>"); // Two stars

    } else if (moves > 17) {
        starRating = 1;
        all_stars.children().remove("li");
        all_stars.append("<li><i class='fa fa-star'></i></li><li><i class='fa fa-star-o'></i></li><li><i class='fa fa-star-o'></i></li>"); // A star
    }
}

function replay() {
    $("ul#cards").children().remove("li");
    $(".stars").children().remove("li");
    $(".stars").append("<li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li>"); // RESET stars
    $(".moves").text("0");
    clearInterval(timerView);
    $("#timer").text("0.000");
    init();
}

// action when user clicks on replay button
function setReplayAction() {
    $(".fa-repeat").click(function () {
        replay();
    });
}

function match(firstCard) {
    $(this).addClass("match");
    firstCard.removeClass("open show").addClass("match");
    firstCardSelected = false;
    matchCount++;
}

function noMatch() {
    $(this).addClass("open show");
    $(".card").addClass("disabled");
    setTimeout(function () {
        $(".open.show").removeClass("open show");
        $(".card").removeClass("disabled");
    }, 800);
    firstCardSelected = false;
}

function gameOver() {
    console.log(totalTime);
    $("#timer").text(totalTime);
    clearInterval(timerView);

    setTimeout(function () {
        let popup = document.getElementById('popup');
        let closeButton = document.getElementById("close-btn");

        $("#total-moves").text(moves);
        $("#total-stars").text(starRating);
        $("#time-summary").text(totalTime);

        popup.style.display = "block";

        closeButton.onclick = function () {
            popup.style.display = "none";
        };

        $("#replay-btn").on("click", function () {
            popup.style.display = "none";
            replay()
        });
    }, 1000);

}

function setTimer() {
    if (timer === 1) {
        let startTime = Date.now();
        timerView = setInterval(function () {
            let elapsedTime = Date.now() - startTime;
            totalTime = (elapsedTime / 1000).toFixed(3);
            $("#timer").text(totalTime);
        }, 44);

    }
}

function init() {
    firstCard = '';
    firstCardIcon = '';
    timerView = null;
    timer = 0;
    totalTime = 0;
    moves = 0;
    firstCardSelected = false;
    matchCount = 0;
    starRating = 3;

    cards = shuffle(cards);
    createDeckFrom(cards);

    $(".card").on("click", function () {

        //game begins
        let currentCard = $(this).attr("class");
        let currentCardIcon = $(this).children().attr("class");

        if (currentCard !== "card") return;

        timer++;

        // Select first card
        if (!firstCardSelected) {
            $(this).addClass("open show");
            firstCardIcon = currentCardIcon;
            firstCard = $(this);
            firstCardSelected = true;
        }

        // when first card matches the second card
        else if (currentCardIcon === firstCardIcon) {
            match.call(this, firstCard);
            moves++;
        }

        // when second card selected is different from first card
        else {
            noMatch.call(this);
            moves++;
        }

        updateScore();

        // check if all cards are matched
        if (matchCount === 8)
            gameOver();

        setTimer();
        setReplayAction();

    });
}

init();