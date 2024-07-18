import './style.css'
import IQuizAll from './Contracts/IQuiz';

let outputArea = document.querySelector(".question-output-area") as HTMLElement;
let startBtn = document.querySelector(".start-btn") as HTMLButtonElement;

let diffEasyBtn = document.querySelector(".diffEasy") as HTMLButtonElement;
let diffHardBtn = document.querySelector(".diffHard") as HTMLButtonElement;
let langEnBtn = document.querySelector(".langEn") as HTMLButtonElement;
let langDeBtn = document.querySelector(".langDe") as HTMLButtonElement;

let easy: boolean | undefined = undefined;
let english: boolean | undefined = undefined;

let counter = 0;
let score = 0;

diffEasyBtn.addEventListener("click", () => {
  easy = true;
  console.log(easy)
  setDifficultyAndLanguage()
});

diffHardBtn.addEventListener("click", () => {
  easy = false;
  setDifficultyAndLanguage()
});

langEnBtn.addEventListener("click", () => {
  english = true;
  setDifficultyAndLanguage()
});

langDeBtn.addEventListener("click", () => {
  english = false;
  setDifficultyAndLanguage()
});

function setDifficultyAndLanguage(){
if (easy === true && english === true){
  fetchDataAndStartQuiz("https://vz-wd-24-01.github.io/typescript-quiz/questions/easy.json");
  outputArea.innerHTML = "";
  outputArea.innerHTML = "Lets go easy"
} else if(easy === true && english === false){
  fetchDataAndStartQuiz("https://vz-wd-24-01.github.io/typescript-quiz/questions/leicht.json");
  outputArea.innerHTML = "";
  outputArea.innerHTML = "Los gehts"
} else if (easy === false && english === true){
  fetchDataAndStartQuiz("https://vz-wd-24-01.github.io/typescript-quiz/questions/hard.json");
  outputArea.innerHTML = "";
  outputArea.innerHTML = "Lets go hard"
} else if (easy === false && english === false) {
  fetchDataAndStartQuiz("https://vz-wd-24-01.github.io/typescript-quiz/questions/schwer.json");
  outputArea.innerHTML = "";
  outputArea.innerHTML = "Los gehts großer"
}
}
function fetchDataAndStartQuiz(fetchUrl:string){

fetch(fetchUrl)
.then((response: Response) => {
  if (!response.ok){
    throw Error(`Error ${response.status} ${response.statusText}`)
  }
  return response.json();
})
.then((response) => {

  let quizAll: IQuizAll[] = response;
  console.log(quizAll);
  startBtn.addEventListener("click", () => {
    generateAndEvaluateQuestionsAndAnswers(quizAll);
  })
  return quizAll
})
.catch((error: Error) => {
  console.error(error);
})
.finally(() => {
  console.log("laoding complete");
})

}

function generateAndEvaluateQuestionsAndAnswers (quizAll:IQuizAll[]){

  startBtn.classList.add("remove");
  diffEasyBtn.classList.add("remove");
  diffHardBtn.classList.add("remove");
  langEnBtn.classList.add("remove");
  langDeBtn.classList.add("remove");

    outputArea.innerHTML = "";
    console.log(counter)
    console.log(quizAll[counter])
    console.log(quizAll[counter].answers)
    counter ++;
  
  outputArea.innerHTML = `
  <div class="q-and-a-wrapper">
  <div class="question-wrapper">
  <div class="question-no">
  <p>${counter}</p>
  </div>
  <p>${quizAll[counter].question}</p>
  </div>
  </div>
  `
  let answerWrapper = outputArea.appendChild(document.createElement("div"));
  let quizAnswers = quizAll[counter].answers;

  answerWrapper.className = "answer-wrapper";

  let answerClicked = false;

  quizAnswers.map((answer, index) => {

    let singleAnswer = answerWrapper.appendChild(document.createElement("p"));
    singleAnswer.className = "single-answer";
    singleAnswer.innerText = answer;

    singleAnswer.addEventListener("click", () => {

      if (answerClicked) return;
      answerClicked = true;
      singleAnswer.classList.add("single-answer-logged");

      setTimeout(() => {
      
        if (index === quizAll[counter].correct){
          console.log("Richitg")
          console.log(`index: ${index}`);
          singleAnswer.classList.add("single-answer-right")
          score +=1;
          console.log(score);
        }
        else{
          console.log("Wrong")
          singleAnswer.classList.add("single-answer-wrong")
        }
      }, 500)
    });
    })

    if (counter === 19){
      let showScoreBtn = outputArea.appendChild(document.createElement("button"));
      showScoreBtn.innerHTML = "Show Score";
      showScoreBtn.addEventListener("click", () => {
        let scoreBoard = outputArea.appendChild(document.createElement("h3"));
          scoreBoard.innerText = score.toString();
      })
      }
      else{
        let nextBtn = outputArea.appendChild(document.createElement("button"));
        nextBtn.innerHTML = "Next";
        nextBtn.addEventListener("click", () =>{
          generateAndEvaluateQuestionsAndAnswers(quizAll);
        });
      }
}