import { useEffect, useState, useRef } from "react"
import { Footer, NavBar, Sections } from "../../Navbar/Navbar"

const DEFAULT_SIZE : number = 20;

enum Color{
    defaultColor = "black",
    highlightColor = "blue",
    sortedColor = "purple",
    swapColor = "red",
    doneColor = "green",
}

class Block{
    value : number;
    height : number;
    color: Color;
    constructor(value : number){
        this.value = value;
        this.height = 30 + (value * 5);
        this.color = Color.defaultColor;
    }
};

export const Sort = () => {
    const [array, setArray] = useState<Block[]>([]); //current array
    const [sorted, setSorted] = useState<boolean>(false); // To flag if the array is sorted
    const [animationOnGoing, setAnimationOnGoing] = useState<boolean>(false); 
    const animationOnGoingRef = useRef(animationOnGoing); // To keep track of the animationOnGoing state

    const fillArray = (size : number) : void => {
        //reset the animation state
        setAnimationOnGoingState(false);
        let newArray : Block[] = [];
        let inside : Set<number> = new Set<number>();
        setSorted(false);
        
        //fill in the array with random values within [0,size)
        for(let i : number = 0; i < size; i++){

            let newValue: number = getRandomArbitrary(0, size);
            while(inside.has(newValue)){
                newValue = getRandomArbitrary(0,size);
            }

            inside.add(newValue)
            newArray.push(new Block(newValue));
        }
        setArray(newArray);
    }

    // delay function
    const sleep = (ms : number) => new Promise(resolve => setTimeout(resolve, ms));

    // update the array
    const updateArray = async (newArray : Block[], time : number) => {
        //only update if there is an ongoing animation
        if(animationOnGoingRef.current){
            setArray([...newArray]);
            await sleep(time);
        }
    }

    // color block of the array[index]
    const colorBlock = async (arr : Block[], index : number, time : number, color : Color) => {
        let copyArray : Block[] = [...arr];
        copyArray[index].color = color;
        await updateArray(copyArray, time);
    }

    // set the animationOnGoing state and update the ref
    const setAnimationOnGoingState = (state : boolean) => {
        setAnimationOnGoing(state);
        animationOnGoingRef.current = state;
    };

    const bubbleSort = async () : Promise<void> => {
        // avoid overlapping animations
        if(animationOnGoing){
            return;
        }
        let localArray : Block[] = [...array]; // copy the array
        let slept : number = 10; // sleep time
        setAnimationOnGoingState(true);

        for(let i : number = 0; i < localArray.length; i++){
            setSorted(true);
            for(let j : number = 0; j < localArray.length - i - 1; j++){
                if (!animationOnGoingRef.current) {
                    // if the animation is stopped, break the animation
                    break;
                }
                await colorBlock(localArray, j, slept, Color.highlightColor); //highlight the current block
                if(localArray[j].value > localArray[j+1].value){
                    setSorted(false); //if swap is made, the array is not sorted

                    //color the swap blocks
                    await colorBlock(localArray, j, slept, Color.swapColor);
                    await colorBlock(localArray, j+1, slept, Color.swapColor);

                    //perform the swap
                    let temp : Block = localArray[j];
                    localArray[j] = localArray[j+1];
                    localArray[j+1] = temp;
                    await updateArray(localArray, slept);
                }
                //reset the color of the current block
                await colorBlock(localArray, j, slept, Color.defaultColor);
            }
            //color the sorted block
            localArray[localArray.length - i - 1].color = Color.sortedColor;
            if(sorted){
                break;
            }
        }
        //animation done
        await finishAnimation(localArray,slept);
    }
    
    const selectionSort = async () : Promise<void> => {
        // avoid overlapping animations
        if(animationOnGoing){
            return;
        }
        let localArray : Block[] = [...array]; // copy the array
        let slept : number = 10; // sleep time
        setAnimationOnGoingState(true);

        for(let i : number = 0; i < localArray.length; i++){
            let maxIndex : number = 0; //max index of the current iteration
            for(let j : number = 0; j < localArray.length - i; j++){
                if (!animationOnGoingRef.current) {
                    // if the animation is stopped, break the animation
                    break;
                }
                //highlight the current block
                await colorBlock(localArray, j, slept, Color.highlightColor);

                //check if the current block is greater than the max block
                if(localArray[j].value > localArray[maxIndex].value){
                    await colorBlock(localArray, maxIndex, slept, Color.defaultColor);
                    maxIndex = j;
                    await colorBlock(localArray, maxIndex, slept, Color.swapColor);
                }else{
                    //reset the color of the current block that isnt that max block
                    await colorBlock(localArray, j, slept, Color.defaultColor);
                }
            }
            //swap the max block with the last unsorted block
            let temp : Block = localArray[maxIndex];
            localArray[maxIndex] = localArray[localArray.length - i - 1];
            localArray[localArray.length - i - 1] = temp;
            await updateArray(localArray, slept);
            await colorBlock(localArray, localArray.length - i - 1, slept, Color.sortedColor);
        }
        //animation done
        await finishAnimation(localArray,slept);
    }

    const finishAnimation = async (arr : Block[], slept : number) : Promise<void> => {
        //cool ending animation
        setAnimationOnGoing(false);
        let copyArray : Block[] = [...arr];
        for(let i : number = 0; i < copyArray.length; i++){
            await colorBlock(copyArray, i, slept, Color.doneColor);
        }
    }

    useEffect(()=>{
        //on load fill the array
        fillArray(DEFAULT_SIZE);
    },[]);

    return(
        <div className="app-container">
            <NavBar active={Sections.Sorting}/>
            <section className="main-container">
                <div className="d-flex justify-content-around">
                    <button onClick={()=>fillArray(DEFAULT_SIZE)}>Generate New Array {`${animationOnGoing}`}</button>
                    <div className="d-flex gap-2">
                        <button onClick={()=>bubbleSort()}>Bubble Sort</button>
                        <button onClick={()=>selectionSort()}>Selection Sort</button>
                        <button onClick={()=>bubbleSort()}>Merge Sort</button>
                        <button onClick={()=>bubbleSort()}>Heap Sort</button>
                    </div>
                </div>
                <div className="d-flex justify-content-center rotate-180 flex-grow-1">
                    {array.map(block => (
                        <div 
                        key = {block.value} 
                        className= "block"
                        style= {{
                            height: `${block.height}px`,
                            backgroundColor: `${block.color}`
                        }}
                        />
                    ))}
                </div>
            </section>
            <Footer/>
        </div>
    )
}

function getRandomArbitrary(min : number, max : number) : number{
    return Math.floor(Math.random() * (max - min) + min);
}