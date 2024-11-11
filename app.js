const firebaseConfig = {
  apiKey: "AIzaSyCEKXTGVqFDtt1Vza9tTeQ1Pxc3bTbCsK0",
  authDomain: "quizapp-3bc36.firebaseapp.com",
  databaseURL: "https://quizapp-3bc36-default-rtdb.firebaseio.com",
  projectId: "quizapp-3bc36",
  storageBucket: "quizapp-3bc36.firebasestorage.app",
  messagingSenderId: "127826771251",
  appId: "1:127826771251:web:b6ecd22456bf82a2429246"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Sign up function
function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showAlert("Please complete all fields", "error");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User signed up successfully:", user);
      
      // Store additional user information
      return database.ref("users/" + user.uid).set({
        name: name,
        email: email
      });
    })
    .then(() => {
      showAlert("Account created! Redirecting to login...", "success");
      setTimeout(() => window.location.href = "index.html", 2000);
    })
    .catch((error) => {
      console.error("Signup error:", error);
      showAlert(error.message, "error");
    });
}

// Login function
function Login() {
  const email = document.getElementById("Loginemail").value;
  const password = document.getElementById("Loginpassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("User signed in");
      showAlert("Login successful! Redirecting to quiz...", "success");
      setTimeout(() => window.location.href = "quiz.html", 2000);
    })
    .catch((error) => {
      console.error("Login error:", error);
      showAlert("Invalid email or password");
    });
}

// Custom alert function
function showAlert(message, type) {
  Swal.fire({
    icon: type === "success" ? "success" : "error",
    title: message,
    timer: 2000,
    showConfirmButton: false
  });
}

const questions = [
  {
    question: "HTML Stands for",
    option1: "Hyper Text Markup Language",
    option2: "Hyper Tech Markup Language",
    option3: "Hyper Touch Markup Language",
    corrAnswer: "Hyper Text Markup Language",
  },
  {
    question: "CSS Stands for",
    option1: "Cascoding Style Sheets",
    option2: "Cascading Style Sheets",
    option3: "Cascating Style Sheets",
    corrAnswer: "Cascading Style Sheets",
  },
  {
    question: "Which tag is used for most large heading",
    option1: "<h6>",
    option2: "<h2>",
    option3: "<h1>",
    corrAnswer: "<h1>",
  },
  {
    question: "Which tag is used to make element unique",
    option1: "id",
    option2: "class",
    option3: "label",
    corrAnswer: "id",
  },
  {
    question: "Any element assigned with id, can be get in css",
    option1: "by # tag",
    option2: "by @ tag",
    option3: "by & tag",
    corrAnswer: "by # tag",
  },
  {
    question: "CSS can be used with ______ methods",
    option1: "8",
    option2: "3",
    option3: "4",
    corrAnswer: "3",
  },
  {
    question: "In JS variable types are ____________",
    option1: "6",
    option2: "3",
    option3: "8",
    corrAnswer: "8",
  },
  {
    question: "In array we can use key name and value",
    option1: "True",
    option2: "False",
    option3: "None of above",
    corrAnswer: "False",
  },
  {
    question: "toFixed() is used to define length of decimal",
    option1: "True",
    option2: "False",
    option3: "None of above",
    corrAnswer: "True",
  },
  {
    question: "push() method is used to add element in the start of array",
    option1: "True",
    option2: "False",
    option3: "None of above",
    corrAnswer: "False",
  },
];

// Variables for the quiz
let currentQuestionIndex = 0;
let score = 0;
const questionElement = document.getElementById('ques');
const option1Label = document.getElementById('opt1');
const option2Label = document.getElementById('opt2');
const option3Label = document.getElementById('opt3');
const nextButton = document.getElementById('btn');
const timerElement = document.getElementById('timer');

let timeRemaining = 120; // 2 minutes in seconds
let timerInterval;

// Function to start the timer
function startTimer() {
  clearInterval(timerInterval); // Stop any existing timer interval
  timeRemaining = 120; // Reset the timer for each question (e.g., 2 minutes)

  timerInterval = setInterval(function () {
    let minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining % 60;
    if (seconds < 10) seconds = "0" + seconds;

    timerElement.textContent = `${minutes}:${seconds}`;
    timeRemaining--;

    if (timeRemaining < 0) {
      clearInterval(timerInterval); // Stop timer when time is up
      nextQuestion(); // Automatically move to the next question when time runs out
    }
  }, 1000); // Update every second
}

// Function to load the current question
function loadQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  option1Label.textContent = currentQuestion.option1;
  option2Label.textContent = currentQuestion.option2;
  option3Label.textContent = currentQuestion.option3;

  startTimer(); // Start a new timer for the question
}

// Function to move to the next question
function nextQuestion() {
  // Validate selected answer
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (selectedOption) {
    const answer = selectedOption.nextElementSibling.textContent;
    if (answer === questions[currentQuestionIndex].corrAnswer) {
      score++; // Increment score for correct answer
    }
    selectedOption.checked = false; // Clear selection
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    loadQuestion(); // Load the next question
    nextButton.disabled = true; // Disable Next button until new option is selected
  } else {
    endQuiz(); // End the quiz when all questions are answered
  }
}

// Enable Next button when an option is selected
function clicked() {
  nextButton.disabled = false;
}

// Function to end the quiz when time runs out or quiz ends
function endQuiz() {
  clearInterval(timerInterval); // Stop the timer when quiz ends

  const percentage = (score / questions.length) * 100;
  let remark = "";

  if (percentage >= 80) {
    remark = "Excellent";
  } else if (percentage >= 60) {
    remark = "Very Good";
  } else if (percentage >= 50) {
    remark = "Good";
  }else {
    remark = "Failed";
  }

  // Create and display custom popup
  const popup = document.createElement("div");
  popup.classList.add("custom-popup");
  popup.innerHTML = `
    <h2>Quiz Completed!</h2>
    <p>Your score: ${score}/${questions.length} (${percentage.toFixed(2)}%)</p>
    <p>Remark: <strong>${remark}</strong></p>
    <button onclick="closePopup()">OK</button>
  `;
  document.body.appendChild(popup);
}

// Function to close the custom popup
function closePopup() {
  const popup = document.querySelector(".custom-popup");
  if (popup) {
    popup.remove();
  }
}

// Load the first question when the page loads
window.onload = function() {
  loadQuestion(); // Load first question
};

// Enhanced custom alert for login errors
function showAlert(message, type) {
  Swal.fire({
      icon: type === "success" ? "success" : "error",
      title: message,
      timer: 2000,
      showConfirmButton: false,
      background: '#f7f9fc',
      customClass: {
          popup: 'animated fadeInDown'
      }
  });
}

// Updated endQuiz function to show result and hide questions
function endQuiz() {
  clearInterval(timerInterval); // Stop the timer when quiz ends

  const percentage = (score / questions.length) * 100;
  let remark = "";

  if (percentage >= 80) {
      remark = "Excellent";
  } else if (percentage >= 60) {
      remark = "Very Good";
  } else if (percentage >= 50) {
      remark = "Good";
  } else {
      remark = "Failed";
  }

  // Hide the quiz container content
  document.querySelector('.quiz-container').style.display = 'none';

  // Display the result in a fancy popup
  const popup = document.createElement("div");
  popup.classList.add("custom-popup");
  popup.innerHTML = `
      <h2>Quiz Completed!</h2>
      <p>Your score: ${score}/${questions.length} (${percentage.toFixed(2)}%)</p>
      <p>Remark: <strong>${remark}</strong></p>
      <button onclick="closePopup()">OK</button>
  `;
  document.body.appendChild(popup);
}

// Close the result popup
function closePopup() {
  const popup = document.querySelector(".custom-popup");
  if (popup) {
      popup.remove();
  }
  window.location.href = "index.html"; // Redirect to home page after closing
}

// Additional logic for styling
window.onload = function() {
  document.body.classList.add('quiz-body'); // Apply quiz body styles
  loadQuestion(); // Load the first question
};
