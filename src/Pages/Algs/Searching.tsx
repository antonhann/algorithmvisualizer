import { useRef, useState } from "react";
import { AppContainer, sleep, SpeedSlider } from "../helper";
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
    const sleepState = useRef(ms); // the current speed of the animation
    const [foundIndex, setFoundIndex] = useState<number>(-1); //index for the found target for resetting search
    const [target, setTarget] = useState<number>(-1); //target to search for

    const updateArray = async (newArray : Box[], time : number) => {
        //only update if there is an ongoing animation
        if(animationOnGoingRef.current){
            setArray([...newArray]);
            await sleep(time);
        }
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
            await colorBox(localArray, i, Color.highlightColor, sleepState.current);
            if(localArray[i].value === target){
                //if the target is found
                setFound(true);
                setFoundIndex(i);
                await colorBox(localArray, i, Color.doneColor, sleepState.current);
                break;
            }
            //reset the color of the box
            await colorBox(localArray, i, Color.defaultColor, sleepState.current);
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
        await colorBox(localArray, l, Color.highlightColor, sleepState.current);
        await colorBox(localArray, r, Color.highlightColor, sleepState.current);
        setAnimationOnGoingState(true);
        //preform binary search
        while (l <= r){
            //middle pointer
            let m : number = Math.floor((l + r) / 2);
            //highlight the middle box
            await colorBox(localArray, m, Color.sortedColor, sleepState.current);
            //if the target is found
            if(localArray[m].value === target){
                //reset the left and right pointers
                colorBox(localArray, l, Color.defaultColor, sleepState.current);
                colorBox(localArray, r, Color.defaultColor, sleepState.current);
                setFound(true);
                setFoundIndex(m);
                await colorBox(localArray, m, Color.doneColor, sleepState.current);
                break;
            }
            else if(localArray[m].value < target){
                //update the left pointer
                colorBox(localArray, l, Color.defaultColor, sleepState.current);
                l = m + 1;
                await colorBox(localArray, l, Color.highlightColor, sleepState.current);
            }
            else{
                //update the right pointer
                colorBox(localArray, r, Color.defaultColor, sleepState.current);
                r = m - 1;
                await colorBox(localArray, r, Color.highlightColor, sleepState.current);
            }
            //reset the middle box
            await colorBox(localArray, m, Color.defaultColor, sleepState.current);
        }
    }
    return (
        <AppContainer>
            <div className="d-flex justify-content-around">
                  <button>Generate Array</button>
                  <div className="d-flex gap-2">
                        <SpeedSlider ms={ms} setMs={setMs} sleepState = {sleepState}/>
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