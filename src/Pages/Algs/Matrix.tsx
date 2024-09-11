import { useEffect, useRef, useState } from "react"
import { AppContainer, sleep } from "../helper"
import { Box } from "./Searching"
import { Color } from "./Sort";

export const Matrix = () => {
    let [array , setArray] = useState<Box[][]>([]);

    let [animationOnGoing, setAnimationOnGoing] = useState<boolean>(false);
    const animationOnGoingRef = useRef(animationOnGoing); // To keep track of the animationOnGoing state
    const setAnimationOnGoingState = (state : boolean) => {
        setAnimationOnGoing(state);
        animationOnGoingRef.current = state;
    };

    const [ms, setMs] = useState<number>(100); // speed of the animation
    const slept = useRef(ms); // the current speed of the animation
    const setSleptState = (time : number) => {
        slept.current = time;
        setMs(time);
    }

    const updateArray = async (newArray : Box[][], time : number) => {
        if(animationOnGoingRef.current){
            setArray([...newArray]);
            await sleep(time);
        }
    }

    const colorBox = async (localArray: Box[][], row : number, col : number, color : string, time : number) => {
        console.log('trying', row,col)
        localArray[row][col].color = color
        await updateArray(localArray,ms)
        console.log(array)
    }

    const handleBoxClick = async (row : number, col : number) => {
        let localArray : Box[][] = [...array]
        setAnimationOnGoingState(true);
        await colorBox(localArray, row, col, Color.doneColor, 1000)
    }

    useEffect(() => {
        let arr : Box[][] = [];
        let j = 1;
        let temp : Box[] = [];
        for(let i = 0; i < 25; i++){
            temp.push(new Box(j, Color.defaultColor))
            j += 1
            if(temp.length == 5){
                arr.push(temp)
                temp = []
            }
        }
        setArray(arr)
    },[])

    return(
        <AppContainer>
            <div className="d-flex justify-content-center flex-column align-items-center flex-grow-1 gap-3">
                {
                    array.map((row, rowIndex) => (
                        <div className = "matrixRow d-flex flex-row justify-content-center gap-3" key = {rowIndex}>
                            {
                                row.map((box, colIndex) => (
                                    <div 
                                    className = "matrixVal d-flex justify-content-center align-items-center"
                                    key = {colIndex}
                                    style= {{
                                        backgroundColor: `${box.color}`
                                    }}
                                    onClick={() => handleBoxClick(rowIndex,colIndex)}
                                    >
                                        {box.value}
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        </AppContainer>
    )
}