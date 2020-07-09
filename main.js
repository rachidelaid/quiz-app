//current question
let quest = 0;
//set score to 0 at the start
let score = 0;

//the delay function, used before switching to the new question
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//choose the difficulty by giving the class "choosen" to the selected div
document.querySelectorAll(".diff div").forEach(elm => {
	elm.addEventListener("click", async () => {
		//remove the call from all the divs
		document.querySelectorAll(".diff div").forEach(e => e.classList.remove("choosen"));
		//then give it to the clicked one
		elm.classList.add("choosen");
	});
});

//getting all the category elements
document.querySelectorAll("div.itemC").forEach(elm => {
	//listing for a click on each one
    elm.addEventListener("click", async () => {
		//set the category to the selected one
        let category = elm.getAttribute("value");

        //hide the category
		document.querySelector(".category").style.display = "none";
		//show spinner
        document.querySelector("#loading").style.visibility = "visible";
		//setting the difficulty
		let diff = document.querySelector('.choosen').innerText;
		//fetch GET request to the url with two variables in there
		const resp = await fetch(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${diff}&type=multiple`);
		//converting the response to JSON
        const data = await resp.json();

		//if there is questions
        if(data.results.length > 0) {
			//hide the spinner
        	document.querySelector("#loading").style.visibility = "hidden";

			//calling the show question function
        	showQ(data);

			//getting all the options (elements)
        	document.querySelectorAll(".options div").forEach(elmnt => {
				//listing for a click on each one
				elmnt.addEventListener("click", async () => {
					//getting the index of the current question
					let index = parseInt(document.querySelector('.question').getAttribute("id"));

					//highlighting the right and the wrong answers
					document.querySelectorAll(".options div").forEach(e => {
						if (e.innerText === data.results[index].correct_answer) {
							//if it is the correct answer give it a sucess class
							e.classList.add("sucess");
						} else {
							//if it the wrong answer give the error class
							e.classList.add("error");
						}
					});

					//adding a delay of 0.9s so the user can see the correct answer
					await delay(900);

					//increases the score if the answer is correct
					if (elmnt.innerText === data.results[index].correct_answer) {
						score++;
					}
					
					//if there is still questions
					if (quest < 9) {
						//adding one to the current question
						quest++;

						//removing the text color from the option for the next question
						document.querySelectorAll(".options div").forEach(e => {
							e.classList.remove("error");
							e.classList.remove("sucess");
						});

						//calling the next question
						showQ(data);
					} else {
						//show the final screen
						document.querySelector(".quiz").style.display = "none";

						document.querySelector(".result h1 span").innerText = score;

						document.querySelector(".result").style.display = "flex";
					}
				});
			});

			//showing the quiz screen
        	document.querySelector(".quiz").style.display = "flex";
        }

    });
});


function showQ(data) {
	//getting a random number between 0 and 3 to mix up the correct answer placement
	const rand = Math.floor(Math.random() * 3);

	//changing the current question
	document.querySelector('.question').innerHTML = data.results[quest].question;
	//adding the index as an id
	document.querySelector('.question').id = quest;

	//setting the other options to 0 to keep track of the available places for the wrong options
	let op = 0;
	for (let i = 0; i < 4; i++) {
		if (i == rand) {
			document.querySelector(`.options div:nth-child(${i+1})`).innerHTML = data.results[quest].correct_answer;
		} else {
			document.querySelector(`.options div:nth-child(${i+1})`).innerHTML = data.results[quest].incorrect_answers[op];

			//increase the options index to mark this place as not available
			op++;
		}
	}
}

//click event for the reload button at the end screen
document.querySelector('#reload').addEventListener("click", () => {
	location.reload();
});