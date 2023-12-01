import React, {useEffect,useRef,useState} from "react";

function Home() {
  
  const typebox = useRef(null);
  const caret = useRef(null)

  const [countDiff,setCountDiff] = useState(0)
  const [target,setTarget] = useState("test")
  const [words,setWords] = useState([])

  useEffect(() => {
    const target = "for i in range(0,1): for i in range for i in range if i in range for i in range"
    const words = target.split(" ")
    const length = words.length
    setTarget(target)
    setWords(words)
    setCountDiff(length)
    typebox.current.addEventListener("keydown", handleKeyDown);
  },[]);

  const initCaret = ()=>{
    const rect = typebox.current.getBoundingClientRect();
    caret.current.style.left = rect.left - 1 + "px"
    caret.current.style.top = rect.top + 1 + "px"
  }

  // Build the word and letter map from a target string
  // To do:
  // Implement a way to handle tabs and newlines
  // Grab target from mongo db collection of targets
  const targetMap = (initCaret) => {
    const map = words.map((e,i) => {
      let word = e.split("")
      return (
        <div className = {i===0 ? "word active" : "word"}>
          {word.map((i) => {return (<letter>{i}</letter> )})}
        </div>
      )
    })
    if (map.length > 0){initCaret()}
    return(
      map
    )
  };
 
  
  // handleKeyDown To do:
  // track metrics; correct, incorrect, wpm, etc.
  // finish implementing the delete key
  // bugfix on extra characters
  // word correctness validation on spacebar
  // validate that user has finished typing the code
  let typed = [] 
  const handleKeyDown = (event) => {
    const active = typebox.current.querySelector(".active");
    const letters = active.querySelectorAll("letter");
    if (event.key !== " " && event.key.length === 1 ){
      //Correctness validation for letters
      if (typed.length < letters.length){
        typed.push(event.key)
        typed.forEach((e,i) => {
          if (e !== letters[i].innerHTML) {
            letters[i].classList.add("incorrect")
          }
          else if (e === letters[i].innerHTML) {
            letters[i].classList.add("correct")
          }
        })
        //Caret Positioning on Keydown
        if (typed.length < letters.length-1){
          const rect = letters[typed.length].getBoundingClientRect();
          caret.current.style.left = rect.left - 1 + "px"
          caret.current.style.top = rect.top + 1 + "px"
        }else{
          const rect = letters[typed.length -1].getBoundingClientRect();
          caret.current.style.left = rect.right - 1 + "px"
          caret.current.style.top = rect.top + 1 + "px"
        }
      }else{
        //Extra characters handling
        const extra = document.createElement("letter")
        extra.classList.add("extra")
        extra.innerHTML = event.key
        active.appendChild(extra) 
        //Caret Positioning on Extra Characters
        const rect = active.querySelectorAll("letter")[typed.length].getBoundingClientRect();
        caret.current.style.left = rect.right - 1 + "px"
        caret.current.style.top = rect.top + 1 + "px"
      }
    }else if (event.key.length === 1 && typed.length > 0){
      //Correctness validtion
      if (letters.length === active.querySelectorAll(".correct").length && typed.length === letters.length){
        active.classList.add("correct")
      } else{
        active.classList.add("incorrect")
      }
      // setCountDiff(countDiff - 1)
      console.log(countDiff)
      //Next word handling
      active.classList.remove("active");
      active.nextElementSibling.classList.add("active");
      typed = []
    
      //Caret Positioning on Next word
      const rect = typebox.current.querySelector(".active").firstChild.getBoundingClientRect();
      caret.current.style.left = rect.left - 1 + "px"
      caret.current.style.top = rect.top + 1 + "px"

    }else if (event.key === "Backspace" && typed.length > 0){
      //Deletion handling
      typed.pop()
      let child = active.lastChild
      if ("extra" in child.classList) {
        child.remove()
      }else{
        child.classList.remove("correct")
        child.classList.remove("incorrect")
      }
      //Move caret on deletion
    }
    
  }
  return (
    <>
        <div id="caret" ref = {caret}></div>
        <div type = "text" ref = {typebox} className = "type faded" tabIndex="0">
          {targetMap(initCaret)}
        </div>
    </>
  );
}

export default Home;
