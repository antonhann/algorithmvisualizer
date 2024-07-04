import { useRef, useState } from "react";
import { AppContainer, sleep } from "../helper";
import { Color } from "../SortPage/Sort";
import { color } from "d3";
class Box{
    value: number;
    color: string;
    constructor(value: number, color: string){
        this.value = value;
        this.color = color;
    }
}
const DEFAULT_ARRAY : Box[] = [];
for(let i = 0; i < 20; i++){
    DEFAULT_ARRAY.push(new Box(i, Color.defaultColor));
}
export const Searching = () => {
    const [array, setArray] = useState<Box[]>(DEFAULT_ARRAY); //current array
    const [animationOnGoing, setAnimationOnGoing] = useState<boolean>(false); 
    const [found, setFound] = useState<boolean>(false);
    const animationOnGoingRef = useRef(animationOnGoing); // To keep track of the animationOnGoing state
    const [ms, setMs] = useState<number>(50); // speed of the animation
    const slept = useRef(ms);
    const [foundIndex, setFoundIndex] = useState<number>(-1);
    const updateArray = async (newArray : Box[], time : number) => {
        //only update if there is an ongoing animation
        if(animationOnGoingRef.current){
            setArray([...newArray]);
            await sleep(time);
        }
    }
    const setSleptState = (time : number) => {
        slept.current = time;
        setMs(time);
    }
    // set the animationOnGoing state and update the ref
    const setAnimationOnGoingState = (state : boolean) => {
        setAnimationOnGoing(state);
        animationOnGoingRef.current = state;
    };
    const colorBox = async (localArray : Box[], index : number, color : string, time : number) => {
        localArray[index].color = color;
        await updateArray(localArray, time);
    }
    const linearSearch = async () => {
        if(foundIndex !== -1){
            colorBox(array, foundIndex, Color.defaultColor, 0);
        }
        let localArray : Box[]= [...array];
        setAnimationOnGoingState(true);
        for(let i : number = 0; i < localArray.length; i++){
            await colorBox(localArray, i, Color.highlightColor, slept.current);
            if(localArray[i].value === 5){
                setFound(true);
                setFoundIndex(i);
                await colorBox(localArray, i, Color.doneColor, slept.current);
                break;
            }
            await colorBox(localArray, i, Color.defaultColor, slept.current);
        }
    }
    const binarySearch = async () => {
        if(foundIndex !== -1){
            colorBox(array, foundIndex, Color.defaultColor, 0);
        }
        let localArray : Box[]= [...array];
        let l : number = 0;
        let r : number = localArray.length - 1;
        let target = 5;
        colorBox(localArray, l, Color.highlightColor, slept.current);
        await colorBox(localArray, r, Color.highlightColor, slept.current);
        setAnimationOnGoingState(true);
        while (l <= r){
            let m : number = Math.floor((l + r) / 2);
            await colorBox(localArray, m, Color.sortedColor, slept.current);
            if(localArray[m].value === target){
                colorBox(localArray, l, Color.defaultColor, slept.current);
                colorBox(localArray, r, Color.defaultColor, slept.current);
                setFound(true);
                setFoundIndex(m);
                await colorBox(localArray, m, Color.doneColor, slept.current);
                break;
            }
            else if(localArray[m].value < target){
                colorBox(localArray, l, Color.defaultColor, slept.current);
                l = m + 1;
                await colorBox(localArray, l, Color.highlightColor, slept.current);
            }
            else{
                colorBox(localArray, r, Color.defaultColor, slept.current);
                r = m - 1;
                await colorBox(localArray, r, Color.highlightColor, slept.current);
            }
            await colorBox(localArray, m, Color.defaultColor, slept.current);
        }
    }
    return (
        <AppContainer>
            <div className="d-flex justify-content-around">
                  <button>Generate Array</button>
                  <div className="d-flex gap-2">
                        <label>Speed: {ms}ms</label>
                        <input
                            className="slider"
                            type="range"
                            min="0"
                            max="1000"
                            value={ms}
                            onChange={(e) => setSleptState(parseInt(e.target.value))}
                        />
                    </div>
                  <div className="d-flex gap-2">
                      <button onClick={() => linearSearch()}>Linear Search</button>
                      <button onClick={() => binarySearch()}>Binary Search</button>
                  </div>
                  <h1>{found ? "Found" : "Not Found"}</h1>
              </div>
              <div className="d-flex justify-content-center align-items-center flex-grow-1">
                {array.map(box => (
                    <div 
                    key = {box.value} 
                    className= "box"
                    style= {{
                        backgroundColor: `${box.color}`
                    }}
                    >
                        {box.value}
                    </div>
                ))}
              </div>
        </AppContainer>
    )
};