import { useEffect, useRef, useState } from "react"
import { AppContainer, sleep, SpeedSlider } from "../helper"
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

    const [isDfs, setIsDfs] = useState<boolean>(true);

    const [ms, setMs] = useState<number>(500); // speed of the animation
    const sleepState = useRef(ms); // the current speed of the animation
    // const setSleptState = (time : number) => {
    //     slept.current = time;
    //     setMs(time);
    // }

    const updateArray = async (newArray : Box[][], time : number) => {
        if(animationOnGoingRef.current){
            setArray([...newArray]);
            await sleep(time);
        }
    }

    const colorBox = async (localArray: Box[][], row : number, col : number, color : string, time : number) => {
        localArray[row][col].color = color
        await updateArray(localArray,time)
        console.log(array)
    }

    const handleBoxClick = async (row : number, col : number) => {
        let localArray : Box[][] = [...array]
        setAnimationOnGoingState(true);
        if (isDfs){
            await dfs(localArray, row, col)
        }else{
            await bfs(localArray, row, col);
        }
    }
    const dfs = async (localArray : Box[][], row : number, col : number) => {
        if (!animationOnGoingRef.current){
            return;
        }
        if (row < 0 || row >= localArray.length || col < 0 || col >= localArray[0].length || 
            localArray[row][col].color === Color.doneColor || localArray[row][col].color === Color.highlightColor){
            return;
        }
        await colorBox(localArray, row, col, Color.highlightColor, ms);
        await dfs(localArray, row+1, col);
        await dfs(localArray, row-1, col);
        await dfs(localArray, row, col+1);
        await dfs(localArray, row, col-1);
        await colorBox(localArray, row, col, Color.doneColor, ms);
    }
    const bfs = async (localArray : Box[][], row : number, col : number) => {
        let queue : number[][] = [];
        queue.push([row,col]);
        while(queue.length > 0){
            let indexes = queue.shift();
            if(!indexes){
                continue;
            }
            let r = indexes[0];
            let c = indexes[1];
            if (r < 0 || r >= localArray.length || c < 0 || c >= localArray[0].length || 
                localArray[r][c].color === Color.doneColor || localArray[r][c].color === Color.highlightColor){
                continue;
            }
            await colorBox(localArray, r, c, Color.highlightColor, ms);
            queue.push([r+1,c]);
            queue.push([r-1,c]);
            queue.push([r,c+1]);
            queue.push([r,c-1]);
            await colorBox(localArray, r, c, Color.doneColor, ms);
        }
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
    const activateDfs = () => {
        setIsDfs(true);
    }
    const activateBfs = () => {
        setIsDfs(false);
    }
    const resetMatrix = () => {
        setAnimationOnGoingState(false);
        let localArray : Box[][] = [...array];
        for(let i = 0; i < localArray.length; i++){
            for(let j = 0; j < localArray[i].length; j++){
                localArray[i][j].color = Color.defaultColor;
            }
        }
        setArray(localArray);
    }

    return(
        <AppContainer>
            <div className="d-flex justify-content-center flex-column align-items-center flex-grow-1 gap-3">
                <div className="d-flex gap-2">
                    <button onClick={() => resetMatrix()}>Reset</button>
                    <SpeedSlider ms={ms} setMs = {setMs} sleepState = {sleepState}/>
                    <button className = {isDfs ? "active" : ""} onClick={() => activateDfs()}>DFS</button>
                    <button className = {isDfs ? "" : "active"} onClick={() => activateBfs()}>BFS</button>
                </div>
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