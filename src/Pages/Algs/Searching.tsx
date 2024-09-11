import { useRef, useState } from "react";
import { AppContainer, sleep } from "../helper";
import { Color } from "./Sort";
export class Box{
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
    const [found, setFound] = useState<boolean>(false); //if the target is found
    const animationOnGoingRef = useRef(animationOnGoing); // To keep track of the animationOnGoing state
    const [ms, setMs] = useState<number>(100); // speed of the animation
    const slept = useRef(ms); // the current speed of the animation
    const [foundIndex, setFoundIndex] = useState<number>(-1); //index for the found target for resetting search
    const [target, setTarget] = useState<number>(-1); //target to search for

    const updateArray = async (newArray : Box[], time : number) => {
        //only update if there is an ongoing animation
        if(animationOnGoingRef.current){
            setArray([...newArray]);
            await sleep(time);
        }
    }
    // set the slept state and update the ref
    const setSleptState = (time : number) => {
        slept.current = time;
        setMs(time);
    }
    // set the animationOnGoing state and update the ref
    const setAnimationOnGoingState = (state : boolean) => {
        setAnimationOnGoing(state);
        animationOnGoingRef.current = state;
    };
    // color the box at index with color with delay of time
    const colorBox = async (localArray : Box[], index : number, color : string, time : number) => {
        localArray[index].color = color;
        await updateArray(localArray, time);
    }
    const linearSearch = async () => {
        //reset the found index if there is one
        if(foundIndex !== -1){
            colorBox(array, foundIndex, Color.defaultColor, 0);
        }
        let localArray : Box[]= [...array]; //copy the array
        setFound(false);
        setAnimationOnGoingState(true);
        //preform linear search
        for(let i : number = 0; i < localArray.length; i++){
            //highlight the current box
            await colorBox(localArray, i, Color.highlightColor, slept.current);
            if(localArray[i].value === target){
                //if the target is found
                setFound(true);
                setFoundIndex(i);
                await colorBox(localArray, i, Color.doneColor, slept.current);
                break;
            }
            //reset the color of the box
            await colorBox(localArray, i, Color.defaultColor, slept.current);
        }
    }
    const binarySearch = async () => {
        console.log(target)
        if(foundIndex !== -1){
            colorBox(array, foundIndex, Color.defaultColor, 0);
        }
        let localArray : Box[]= [...array];
        //sort the array

        //left and right pointers
        let l : number = 0;
        let r : number = localArray.length - 1;
        setFound(false);
        //highlight the left and right boxes
        await colorBox(localArray, l, Color.highlightColor, slept.current);
        await colorBox(localArray, r, Color.highlightColor, slept.current);
        setAnimationOnGoingState(true);
        //preform binary search
        while (l <= r){
            //middle pointer
            let m : number = Math.floor((l + r) / 2);
            //highlight the middle box
            await colorBox(localArray, m, Color.sortedColor, slept.current);
            //if the target is found
            if(localArray[m].value === target){
                //reset the left and right pointers
                colorBox(localArray, l, Color.defaultColor, slept.current);
                colorBox(localArray, r, Color.defaultColor, slept.current);
                setFound(true);
                setFoundIndex(m);
                await colorBox(localArray, m, Color.doneColor, slept.current);
                break;
            }
            else if(localArray[m].value < target){
                //update the left pointer
                colorBox(localArray, l, Color.defaultColor, slept.current);
                l = m + 1;
                await colorBox(localArray, l, Color.highlightColor, slept.current);
            }
            else{
                //update the right pointer
                colorBox(localArray, r, Color.defaultColor, slept.current);
                r = m - 1;
                await colorBox(localArray, r, Color.highlightColor, slept.current);
            }
            //reset the middle box
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
                              <input
                                type="number"
                                value={target}
                                min="0"
                                max= "100"
                                onChange={(e) => setTarget(parseInt(e.target.value))}
                                step="any"
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