const welcomeContainer = document.querySelector(".welcome-container");
const questionNumber = document.querySelector(".question-number");
const questionText = document.querySelector(".question-text");   
const optionContainer = document.querySelector(".option-container");
const answersIndicatorContainer = document.querySelector(".answers-indicator");
const chronometerContainer = document.querySelector(".chronometer-container");
const homeBox = document.querySelector(".home-box");
const quizBox = document.querySelector(".quiz-box");
const resultBox = document.querySelector(".result-box");

const img = document.querySelector(".img");

let questionCounter = 0;
let currentQuestion;
let availableQuestions = [];
let availableOptions = [];
let correctAnswers = 0;
let attemp = 0;
let startedQuizTime;
let isQuizRunning = true;

let rightAnswer = new Audio('mp3/right_answer.mp3')
let wrongAnswer = new Audio('mp3/wrong_answer.mp3')
let aplause = new Audio('mp3/aplause.mp3')
let gameOver = new Audio('mp3/game_over.mp3')
let questions = new Audio('mp3/questions.mp3')

function welcome(){    
    var userName = document.getElementById("txtName").value;
    d = new Date();
    hour = d.getHours();

    if (hour < 12) {
        welcomeContainer.innerHTML = "Good Morning, " + userName;
    } else if (hour < 18) {
        welcomeContainer.innerHTML = "Good Afternoon, " + userName;
    } else {
        welcomeContainer.innerHTML = "Good Evening, " + + userName;
    } 
}

// push the questions into availableQuestions Array
function setAvailableQuestions(){
    const totalQuestion = quiz.length;
    for(let i=0; i<totalQuestion; i++){
        availableQuestions.push(quiz[i])
    }  
}

// set question number and question and options
function getNewQuestion(){
    // set question number
    questionNumber.innerHTML = "Question " + (questionCounter + 1) + " of " + quiz.length;

    //set question text
    //get random question
    questions.play();
    const questionIndex = availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
    currentQuestion = questionIndex;
    $(".img").attr("src",currentQuestion.img)
    questionText.innerHTML = currentQuestion.q;

    //get the position of 'questionIndex' from the availableQuestion Array;
    const index1 = availableQuestions.indexOf(questionIndex);
    //remove the 'questionIndex' from availableQuestions Array, so that the question does not repeat
    availableQuestions.splice(index1,1);

    //set options
    //get the lenght of options
    const optionLen = currentQuestion.options.length

    //push options into availableOptions Array
    for(let i = 0; i<optionLen; i++){
        availableOptions.push(i)
    }

    optionContainer.innerHTML = '';
    let animationDelay = 0.15;
    
    //create options in html
    for(let i = 0; i<optionLen; i++){
        //random option
        const optionIndex = availableOptions[Math.floor(Math.random() * availableOptions.length)]
        //get the position of 'optionIndex' from  the availableOptions Array
        const index2 = availableOptions.indexOf(optionIndex);
        //remove 'optionIndex' from  the availableOptions Array, so that the options does not repeat
        availableOptions.splice(index2,1);

        const option = document.createElement("div");
        option.innerHTML = currentQuestion.options[optionIndex];
        option.id = optionIndex;
        option.style.animationDelay = animationDelay + 's';
        animationDelay = animationDelay + 0.15;
        option.className = "option";
        optionContainer.appendChild(option)
        option.setAttribute("onclick","getResult(this)");
    }

    questionCounter++

}

// get the result of current attemp question
function getResult(element){
    const id = parseInt(element.id);
    //get the answer by comparing the id of clicked option
    if(id === currentQuestion.answer){
        //set the green color to the correct option
        element.classList.add("correct");
        //set the right_answer.mp3 to the correct option
        rightAnswer.play();
        //add the indicator to correct mark
        updateAnswerIndicator("correct");
        correctAnswers++;
    }
    else{
        //set the red color to the incorrect option
        element.classList.add("wrong");
        //set the wrong_answer.mp3 to the correct option
        wrongAnswer.play();
         //add the indicator to incorrect mark
        updateAnswerIndicator("wrong");

        //if the answer is incorrect show the correct option by adding green color the correct option
        const optionLen = optionContainer.children.length;
        for(let i = 0; i<optionLen; i++){
            if(parseInt(optionContainer.children[i].id) === currentQuestion.answer){
                optionContainer.children[i].classList.add("correct");
            }
        }
    }
  attemp++;
  unclickableOptions();
}

//make all the options unclickable once the user select a option (RESTRICT THE USER TO CHANGE THE OPTION AGAIN)
function unclickableOptions(){
    const optionLen = optionContainer.children.length;
    for(let i = 0; i<optionLen; i++){
        optionContainer.children[i].classList.add("already-answered");
    }

}

function answersIndicator(){
    answersIndicatorContainer.innerHTML = '';
    const totalQuestion = quiz.length;
    
    for(let i = 0; i<totalQuestion; i++){
        const indicator = document.createElement("div");
        answersIndicatorContainer.appendChild(indicator);
    }
}

function updateAnswerIndicator(markType){
    answersIndicatorContainer.children[questionCounter-1].classList.add(markType)

}

function next(){
    if(questionCounter === quiz.length){
        quizOver();
    } else if (questionCounter == attemp) {
        getNewQuestion();
    }
}

function quizOver(){
    isQuizRunning = false;
    //hide quiz quizbox
    quizBox.classList.add("hide");
    //show result box
    resultBox.classList.remove("hide");
    quizResult();
}

//get the quiz Result
function  quizResult(){
    let bonus = 0;
    let seconds = parseInt((new Date() - startedQuizTime) / 1000);

    aplause.play();

    if(seconds < 60) {
        bonus = 2;
    }

    //condition to not show percentage greater than 100.
    let percentage = ((correctAnswers + bonus)/quiz.length) * 100;
    percentage = (percentage > 100 ? 100 : percentage);

    resultBox.querySelector(".total-question").innerHTML = quiz.length;
    resultBox.querySelector(".total-attempt").innerHTML = attemp;
    resultBox.querySelector(".total-correct").innerHTML = correctAnswers;
    resultBox.querySelector(".total-wrong").innerHTML = attemp - correctAnswers;
    resultBox.querySelector(".bonus").innerHTML = bonus;
    resultBox.querySelector(".percentage").innerHTML = percentage.toFixed(2) + "%";
    resultBox.querySelector(".total-score").innerHTML = (correctAnswers + bonus) + " / " + quiz.length;

    
}

function resetQuiz(){
    questionCounter = 0;
    correctAnswers = 0;
    attemp = 0;
}

function tryAgainQuiz() {
    //hide the resultBox
    resultBox.classList.add("hide");
    //show teh quizBox
    quizBox.classList.remove("hide");
    aplause.pause();
    resetQuiz();
    startQuiz();
    
}

function goToHome(){
    // hide result Box
    resultBox.classList.add("hide")
    // show home box
    homeBox.classList.remove("hide")
    aplause.pause();
    resetQuiz();
    
}

// #### Starting Point ####

function startQuiz(){   
    isQuizRunning = true;
    startedQuizTime = new Date();

    welcome();

    //hide home box
    homeBox.classList.add("hide");
    //show quiz box
    quizBox.classList.remove("hide");
    
    // first we will set all questions in availableQuestions Array
    setAvailableQuestions();
    // second  we will call get getNewQuestion(); function
    getNewQuestion();
    // to create indicator of answers
    answersIndicator();

    setInterval(function(){updateChronometer();}, 500);
}

function updateChronometer() {
    if (isQuizRunning) {
        
        let currentQuizTime = new Date();
        let  minutes = 0;
        //
        let seconds = parseInt((currentQuizTime - startedQuizTime) / 1000);
    
        if (seconds > 120) {
            isQuizRunning = false;
            gameOver.play();
            window.alert("Your time is over!");
            quizOver();
        }
    
        if (seconds > 59) {
            minutes = parseInt(seconds / 60);
            seconds = seconds - (60 * minutes);     
        }
    
        chronometerContainer.innerHTML = "Time: " + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
    }
}

window.onload = function(){
    homeBox.querySelector(".total-question").innerHTML = quiz.length;
}