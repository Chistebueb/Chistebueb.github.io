/*document.getElementById("input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
            calculateWorkTime();
    }
  });
*/

function calculateWorkTime() {
    let input = document.getElementById("input").value;
    let timeStrings = input.split("/");
    let workTime = 0;
    var red = false;


    //checking for errors, before the calculation starts
    if(timeStrings[0].length < 8 || timeStrings[1].length < 8)
    {
        document.getElementById("result").style.color = "red";
        document.getElementById("result").innerHTML = "ERROR: wrong format!";
        return;
    }


    for (let i = 0; i < timeStrings.length; i++) {
      let time = timeStrings[i].split("-");
      let start = time[0];
      let end = time[1];


        //check for errors
        if(red || start.length !== 4 || (end.replace('[','')).length !== 4)
        {
            document.getElementById("result").style.color = "red";
            document.getElementById("result").innerHTML = "ERROR: wrong format!";
            return;
        }
        else
        {
            document.getElementById("result").style.color = "#fff";
        }


      let breakIndex = end.indexOf("[");
      let breakTime = 0;
      if (breakIndex !== -1) {
        let breakstring = end.substring(breakIndex + 1, end.indexOf("]"));
        if(breakstring.includes("["))
        {
            breakstring = time[2].replace(']','');
        }
        else
        {
            document.getElementById("result").style.color = "red";
            document.getElementById("result").innerHTML = "ERROR: wrong format!";
            return;
        }

        breakTime = parseInt(breakstring);
        end = end.substring(0, breakIndex);
      }
      let startHour = parseInt(start.substring(0, 2));
      let startMinute = parseInt(start.substring(2, 4));
      let endHour = parseInt(end.substring(0, 2));
      let endMinute = parseInt(end.substring(2, 4));
      let totalMinutes = (endHour - startHour) * 60 + (endMinute - startMinute) - breakTime;
      workTime += totalMinutes;
    }
    let hours = Math.floor(workTime / 60);
    let minutes = workTime % 60;

    //check for errors again
    if(workTime==NaN)
    {
        document.getElementById("result").style.color = "red";
        document.getElementById("result").innerHTML = "ERROR: unidentifiable character!";
        return;
    }

    if(workTime < 0)
    {
        document.getElementById("result").style.color = "red";
        document.getElementById("result").innerHTML = "ERROR: impossible Time!";
        return;
    }

    if(hours < 6 || hours > 10)
    {
        document.getElementById("result").style.color = "red";
        document.getElementById("result").innerHTML = "Unlikely time:" + hours + " hours and " + minutes + " minutes";
        saveWorkTime();
        return;
    }

    document.getElementById("result").innerHTML = "Total work time: " + hours + " hours and " + minutes + " minutes";
    saveWorkTime();
}



function insertIntoInput(event) {
    let workTime = event.target.innerHTML;
    document.getElementById("input").value = workTime;
  }
  
  function saveWorkTime() {
    let workTime = document.getElementById("input").value;
    let list = document.getElementById("saved-list");
    let items = list.getElementsByTagName("li");
    let duplicateIndex = -1;
    for (let i = 0; i < items.length; i++) {
      if (items[i].innerHTML === workTime) {
        duplicateIndex = i;
        break;
      }
    }
    if (duplicateIndex !== -1) {
      list.removeChild(items[duplicateIndex]);
    }
    if(items.length > 9)
    {
        list.removeChild(items[8]);
    }
    let newItem = document.createElement("li");
    let newButton = document.createElement("button");
    newButton.innerHTML = workTime;
    newButton.addEventListener("click", insertIntoInput);
    newItem.appendChild(newButton);
    list.insertBefore(newItem, list.firstChild);
    let savedWorkTimes = JSON.parse(localStorage.getItem("savedWorkTimes")) || [];
    if (duplicateIndex !== -1) {
      savedWorkTimes.splice(duplicateIndex, 1);
    }
    savedWorkTimes.unshift(workTime);
    localStorage.setItem("savedWorkTimes", JSON.stringify(savedWorkTimes));
  }
  
  window.onload = function() {
    let savedWorkTimes = JSON.parse(localStorage.getItem("savedWorkTimes")) || [];
    let list = document.getElementById("saved-list");
    let uniqueWorkTimes = [];
    for (let i = 0; i < savedWorkTimes.length; i++) {
      if (!uniqueWorkTimes.includes(savedWorkTimes[i])) {
        uniqueWorkTimes.push(savedWorkTimes[i]);
        let newItem = document.createElement("li");
        let newButton = document.createElement("button");
        newButton.innerHTML = savedWorkTimes[i];
        newButton.addEventListener("click", insertIntoInput);
        newItem.appendChild(newButton);
        list.insertBefore(newItem, list.firstChild);
      }
    }
    if(list.getElementsByTagName("li").length > 9)
    {
        list.removeChild(list.getElementsByTagName("li")[8]);
    }
    localStorage.setItem("savedWorkTimes", JSON.stringify(uniqueWorkTimes));
  }
  

  function clearWorkTimes() {
    localStorage.removeItem("savedWorkTimes");
    let list = document.getElementById("saved-list");
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  }
