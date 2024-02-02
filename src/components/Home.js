import React, {useEffect,useRef,useState} from "react";
import Stats from "./Stats";
import HeatMap from "./HeatMap";
function Home() {
  
  const typebox = useRef(null);
  const caret = useRef(null)
  const [target,setTarget] = useState("")
  const [words,setWords] = useState([])
  const [caretX,setCaretX] = useState(null)
  const [caretY,setCaretY] = useState(null)
  const [isStats,setIsStats] = useState(false)
  const [elapsed,setElapsed] = useState(0)
  const [data,setData] = useState([])
  
  let localTimer = 0;
  let raw = 0;
  let correct = 0;
  let incorrect = 0;
  let allowableExtra = 5;

  // dir == "left" or "right"
  const changeXY = (dir, rect) => {
    setCaretX(rect[dir] - 1 + "px")
    setCaretY(rect.top + 1 + "px")
  }

  useEffect(() => {
    const target = "for i in range(0,1): for i in range for i in range if i in range for i in range"
    const words = target.split(" ")
    setTarget(target)
    setWords(words)
    typebox.current.addEventListener("keydown", handleKeyDown);
    changeXY("left", typebox.current.getBoundingClientRect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  // Build the word and letter map from a target string
  // To do:
  // Implement a way to handle tabs and newlines
  // Grab target from mongo db collection of targets
  const targetMap = () => {
    const map = words.map((e,i) => {
      let word = e.split("")
      return (
        <div className = {i===0 ? "word active" : "word"}>
          {word.map((i) => {return (<letter>{i}</letter> )})}
        </div>
      )
    })
    if (map.length > 0) {
      caret.current.style.left = caretX
      caret.current.style.top = caretY
    }
    return map
  };
  const millisecondTimer = () => {
    localTimer += 10
    setElapsed(localTimer)
    if (localTimer % 1000 === 0) {
      createDataPoint(true)
    }
  }
  const createDataPoint = (option) => {
    const second = localTimer / 1000
    const newData = { // true
      "name":`${Math.round(second * 10) / 10}`,
      "raw": (raw/second),
      "cpm": (correct/second),
      "err": incorrect
    }
    const emptyData = { // false
      "name":`${Math.ceil(localTimer / 1000)}`,
      "raw": 0,
      "cpm": 0,
      "err": 0
    }

    setData(data => [...data,option ? newData : emptyData ])
  }
  // handleKeyDown To do:
  // track metrics; correct, incorrect, wpm, etc.
  // finish implementing the delete key
  // bugfix on extra characters
  // word correctness validation on spacebar
  // validate that user has finished typing the code
  let typed = [] 
  let timer = null
  const handleKeyDown = (event) => {
    const active = typebox.current.querySelector(".active");
    const letters = active.querySelectorAll("letter");
    if (event.key !== " " && event.key.length === 1 ) {
     
      //Correctness validation for letters
      if (typed.length < letters.length) {
        typed.push(event.key)
        typed.forEach((e,i) => {
          if (e !== letters[i].innerHTML) {
            letters[i].classList.add("incorrect")
            incorrect += 1
          }
          else if (e === letters[i].innerHTML) {
            letters[i].classList.add("correct")
            correct += 1
          }
          raw += 1
        })
        //Start timer 
        if (active.previousElementSibling == null && typed.length === 1) {
            timer = setInterval(() => {millisecondTimer()},10)
        }
     
        //Caret Positioning on Keydown
        if (typed.length < letters.length-1) {
          changeXY("left", letters[typed.length].getBoundingClientRect());
        }else{
          changeXY("right", letters[typed.length -1].getBoundingClientRect());
        }
      }else{
        //Extra characters handling
        if (allowableExtra !== 0) {
          const extra = document.createElement("letter")
          extra.classList.add("extra")
          extra.innerHTML = event.key
          active.appendChild(extra) 
          typed.push(event.key)
          //Caret Positioning on Extra Characters
          changeXY("right", active.querySelectorAll("letter")[typed.length-1].getBoundingClientRect());
        }
      }
    }else if (event.key.length === 1 && typed.length > 0) { // Space Bar
      //Correctness validtion
      if (letters.length === active.querySelectorAll(".correct").length && typed.length === letters.length) {
        active.classList.add("correct")
        
      } else{
        active.classList.add("incorrect")
      }
      //Finish typing
      if (active.nextElementSibling == null) {
        setIsStats(true);
        clearInterval(timer);
        createDataPoint(true); // create a data point at the time of the last typed character
        //createDataPoint(false); // create a data point at the time of the closest integer greater than the last typed character
      }

      //Next word handling
      active.classList.remove("active");
      active.nextElementSibling.classList.add("active");
      typed = []
      //Caret Positioning on Next word
      changeXY("left", typebox.current.querySelector(".active").firstChild.getBoundingClientRect());

    }else if (event.key === "Backspace" && typed.length > 0) {
      //Deletion handling
      let child = active.children[typed.length - 1]
      typed.pop()
      if ("extra" === active.lastChild.classList[0]) {
        active.lastChild.remove()
        changeXY("left", active.lastChild.getBoundingClientRect());
      }else{
        child.classList.remove("correct")
        child.classList.remove("incorrect")
        if (typed.length > 0) {
          let removed = active.children[typed.length - 1]
          changeXY("right", removed.getBoundingClientRect());
        }else if (typed.length === 0) {
          let removed = active.children[typed.length]
          changeXY("left", removed.getBoundingClientRect());
        }
      }

      //Move caret on deletion
    }
    
  }
  return (
    <>
        {isStats ?
        <>
          <div>{Math.round(elapsed/1000 * 10) / 10}s</div>
          <Stats data = {data} width = {1230} height = {250} />
          <HeatMap data = {data} width = {1200} height = {300} />
        </>
        : 
        <>
          <div id="caret" ref = {caret}></div>
          <div>{Math.round(elapsed/1000 * 10) / 10}s</div>
          <div type = "text" ref = {typebox} className = "type faded" tabIndex="0">
            {targetMap()}
          </div>
        </>}
        <button type = "button" onClick={() => {if(isStats) {window.location.reload()}else{setIsStats(!isStats)}}}>Toggle stats</button>
    </>
  );
}

export default Home;
