var count = 2; // number of form people already on page
function addPerson() {
    let personInputDiv = document.createElement("div");
    personInputDiv.id = "person-" + count + "-div";
    personInputDiv.classList.add("person-div");
    document.getElementById("script-added-inputs-div").appendChild(personInputDiv);
    let nameInput = document.createElement("input");
    nameInput.id = "name-" + count;
    nameInput.type = "text";
    nameInput.placeholder = "Name " + (count + 1);
    nameInput.classList.add("name");
    personInputDiv.appendChild(nameInput);
    let amountInput = document.createElement("input");
    amountInput.id = "amount-" + count;
    amountInput.type = "number";
    amountInput.placeholder = "Amount " + (count + 1);
    amountInput.classList.add("amount");
    personInputDiv.appendChild(amountInput);
    count++;
}

//find average of amounts
var amounts = [];
var avg;
function getAverage(){
    for (i=0; i<count; i++) {
        amounts.push(document.getElementById("amount-" + i).value);
    }
    var total = 0;
    for (i=0; i<amounts.length; i++) {
    total += parseInt(amounts[i]);
    }
    avg = total / amounts.length;
}

//build an array of person objects with name and values
var sortedPeopleArray = [];
function buildSortedPeopleArray() {
    for (i=0; i<count; i++) {
        let amountInput = document.getElementById("amount-" + i).value;
        let person = {
            name: document.getElementById("name-" + i).value,
            amountPaid: document.getElementById("amount-" + i).value,
            isSettled: false,
            diffFromAvg: Math.abs(avg - amountInput),
        }
        sortedPeopleArray.push(person);
    }
    sortedPeopleArray.sort((a, b) => (a.amountPaid - b.amountPaid));
}

//main cost splitting algorithm
function calculateSplit() {
    //if calculate has been split, request user clears/refreshes
    if (document.getElementById("btn-calculate-split").classList.contains("btn-pressed")) {
        let result = document.createElement("p");
        result.classList.add("result");
        result.innerHTML = `Click "Clear All", then try again.`;
        document.getElementById("results-area").appendChild(result);
    } else {
        let top = sortedPeopleArray.length - 1;
        for (i=0; i<sortedPeopleArray.length; i++) {
            if (i >= top) {
                break;
            } else {
                if (sortedPeopleArray[i].diffFromAvg < sortedPeopleArray[top].diffFromAvg) {
                    let result = document.createElement("p");
                    result.classList.add("result");
                    result.innerHTML = `${sortedPeopleArray[i].name} pays ${sortedPeopleArray[top].name} $${sortedPeopleArray[i].diffFromAvg.toFixed(2)}.`;
                    document.getElementById("results-area").appendChild(result);
                    sortedPeopleArray[top].diffFromAvg -= sortedPeopleArray[i].diffFromAvg;
                    sortedPeopleArray[i].diffFromAvg = 0;
                    sortedPeopleArray[i].isSettled = true;
                } else if (sortedPeopleArray[i].diffFromAvg > sortedPeopleArray[top].diffFromAvg) {
                    let result = document.createElement("p");
                    result.classList.add("result");
                    result.innerHTML = `${sortedPeopleArray[i].name} pays ${sortedPeopleArray[top].name} $${sortedPeopleArray[i].diffFromAvg.toFixed(2)}.`;
                    document.getElementById("results-area").appendChild(result);
                    sortedPeopleArray[i].diffFromAvg -= sortedPeopleArray[top].diffFromAvg;
                    sortedPeopleArray[top].diffFromAvg = 0;
                    sortedPeopleArray[top].isSettled = true;
                    top--;
                    i--;
                } else if (sortedPeopleArray[i].diffFromAvg === sortedPeopleArray[top].diffFromAvg) {
                    let result = document.createElement("p");
                    result.classList.add("result");
                    result.innerHTML = `${sortedPeopleArray[i].name} pays ${sortedPeopleArray[top].name} $${sortedPeopleArray[i].diffFromAvg.toFixed(2)}.`;
                    document.getElementById("results-area").appendChild(result);
                    sortedPeopleArray[top].diffFromAvg = 0;
                    sortedPeopleArray[top].isSettled = true;
                    sortedPeopleArray[i].diffFromAvg = 0;
                    sortedPeopleArray[i].isSettled = true;
                    top--;
                }
            }
        }
    }
}

//change calculate split button colour when pushed
//when this button changes, the calculate function can't be called again until the page is refreshed
function changeCalcButton() {
    document.getElementById("btn-calculate-split").classList.add("btn-pressed");
}

//refresh page and clear values
function clearAll() {
    location.reload();
}