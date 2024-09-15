import { useEffect, useState, useRef } from "react"
import { AppContainer, sleep, SpeedSlider} from "../helper";
const DEFAULT_SIZE : number = 50;
export enum Color{
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
class Animation{
    type: Color;
    indexes: number[];
    length: number | undefined;
    constructor(type: Color, indexes: number[], length?: number){
        this.type = type;
        this.indexes = indexes;
        this.length = length;
    }
}
export const Sort = () => {
    const [array, setArray] = useState<Block[]>([]); //current array
    const [animationOnGoing, setAnimationOnGoing] = useState<boolean>(false); 
    const animationOnGoingRef = useRef(animationOnGoing); // To keep track of the animationOnGoing state
    const [ms, setMs] = useState<number>(10);
    const sleepState = useRef(ms);
    const fillArray = (size : number) : void => {
        //reset the animation state
        setAnimationOnGoingState(false);
        let newArray : Block[] = [];
        let inside : Set<number> = new Set<number>();
        
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
        arr[index].color = color;
        await updateArray(arr, time);
    }

    // set the animationOnGoing state and update the ref
    const setAnimationOnGoingState = (state : boolean) => {
        setAnimationOnGoing(state);
        animationOnGoingRef.current = state;
    };

    const bubbleSort = async () : Promise<void> => {
        // avoid overlapping animations
        if(animationOnGoingRef.current){
            return;
        }
        let localArray : Block[] = [...array]; // copy the array
        setAnimationOnGoingState(true);

        for(let i : number = 0; i < localArray.length; i++){
            for(let j : number = 0; j < localArray.length - i - 1; j++){
                if (!animationOnGoingRef.current) {
                    // if the animation is stopped, break the animation
                    break;
                }
                await colorBlock(localArray, j, sleepState.current, Color.highlightColor); //highlight the current block
                if(localArray[j].value > localArray[j+1].value){
                    //color the swap blocks
                    await colorBlock(localArray, j, sleepState.current, Color.swapColor);
                    await colorBlock(localArray, j+1, sleepState.current, Color.swapColor);

                    //perform the swap
                    let temp : Block = localArray[j];
                    localArray[j] = localArray[j+1];
                    localArray[j+1] = temp;
                    await updateArray(localArray, sleepState.current);
                }
                //reset the color of the current block
                await colorBlock(localArray, j, sleepState.current, Color.defaultColor);
            }
            //color the sorted block
            localArray[localArray.length - i - 1].color = Color.sortedColor;
        }
        //animation done
        await finishAnimation(localArray);
    }
    
    const selectionSort = async () : Promise<void> => {
        // avoid overlapping animations
        if(animationOnGoingRef.current){
            return;
        }
        let localArray : Block[] = [...array]; // copy the array
        setAnimationOnGoingState(true);

        for(let i : number = 0; i < localArray.length; i++){
            let maxIndex : number = 0; //max index of the current iteration
            for(let j : number = 0; j < localArray.length - i; j++){
                if (!animationOnGoingRef.current) {
                    // if the animation is stopped, break the animation
                    break;
                }
                //highlight the current block
                await colorBlock(localArray, j, sleepState.current, Color.highlightColor);

                //check if the current block is greater than the max block
                if(localArray[j].value > localArray[maxIndex].value){
                    await colorBlock(localArray, maxIndex, sleepState.current, Color.defaultColor);
                    maxIndex = j;
                    await colorBlock(localArray, maxIndex, sleepState.current, Color.swapColor);
                }else{
                    //reset the color of the current block that isnt that max block
                    await colorBlock(localArray, j, sleepState.current, Color.defaultColor);
                }
            }
            //swap the max block with the last unsorted block
            let temp : Block = localArray[maxIndex];
            localArray[maxIndex] = localArray[localArray.length - i - 1];
            localArray[localArray.length - i - 1] = temp;
            await updateArray(localArray, sleepState.current);
            await colorBlock(localArray, localArray.length - i - 1, sleepState.current, Color.sortedColor);
        }
        //animation done
        await finishAnimation(localArray);
    }
    const heapAnimations = async () : Promise<void> =>{
        if(animationOnGoingRef.current){
            return;
        }
        let animations : Animation[] = [];
        heapSort(animations);
        let localArray : Block[] = [...array];
        for(let animation of animations){
            if(!animationOnGoingRef.current){
                break;
            }
            if(animation.type === Color.highlightColor || animation.type === Color.defaultColor){
                for(let index of animation.indexes){
                    if (animation.length && index > 0 && index < animation.length) {
                        await colorBlock(localArray, index, sleepState.current, animation.type);
                    }
                }
            }
            else if(animation.type === Color.swapColor || animation.type === Color.sortedColor){
                let firstIndex : number = animation.indexes[0];
                let secondIndex : number = animation.indexes[1];
                await colorBlock(localArray, firstIndex, sleepState.current, Color.swapColor);
                await colorBlock(localArray, secondIndex, sleepState.current, Color.swapColor);
                let temp : Block = localArray[firstIndex];
                localArray[firstIndex] = localArray[secondIndex];
                localArray[secondIndex] = temp;
                await updateArray(localArray, sleepState.current);
                let color = animation.type === Color.swapColor ? Color.defaultColor : Color.sortedColor;
                await colorBlock(localArray, firstIndex, sleepState.current, color);
                await colorBlock(localArray, secondIndex, sleepState.current, color);
            }
        }
        await finishAnimation(localArray);
    }
    const heapSort = (animations : Animation[]) : void => {
        // avoid overlapping animations
        let localArray : Block[] = [...array]; // copy the array
        setAnimationOnGoingState(true);

        let parent : number = Math.floor(localArray.length / 2 - 1);
        while(parent >= 0){
            heapify(localArray, animations, localArray.length, parent);
            parent--;
        }   
        let end : number = localArray.length - 1;
        while(end >= 0){
            let temp : Block = localArray[0];
            localArray[0] = localArray[end];
            localArray[end] = temp;
            animations.push(new Animation(Color.sortedColor, [0, end]));
            heapify(localArray, animations, end, 0);
            end--;
        }
    }

    const heapify = (arr : Block[], animations: Animation[], length : number, parentIndex: number) : void =>{
        let leftIndex : number = 2 * parentIndex + 1;
        let rightIndex : number = 2 * parentIndex + 2;
        let largestIndex : number = parentIndex;
        animations.push(new Animation(Color.highlightColor, [parentIndex, leftIndex, rightIndex], length));
        if(leftIndex < length && arr[leftIndex].value > arr[largestIndex].value){
            largestIndex = leftIndex;
        }
        if(rightIndex < length && arr[rightIndex].value > arr[largestIndex].value){
            largestIndex = rightIndex;
        }
        if(largestIndex !== parentIndex){
            let temp : Block = arr[parentIndex];
            arr[parentIndex] = arr[largestIndex];
            arr[largestIndex] = temp;
            animations.push(new Animation(Color.swapColor, [parentIndex, largestIndex]));
            heapify(arr, animations, length, largestIndex);
        }
        animations.push(new Animation(Color.defaultColor, [parentIndex, leftIndex, rightIndex],length));
    }   

    const finishAnimation = async (arr : Block[]) : Promise<void> => {
        //cool ending animation
        setAnimationOnGoing(false);
        let copyArray : Block[] = [...arr];
        for(let i : number = 0; i < copyArray.length; i++){
            await colorBlock(copyArray, i, sleepState.current, Color.doneColor);
        }
    }

    useEffect(()=>{
        //on load fill the array
        fillArray(DEFAULT_SIZE);
    },[]);

    return(
        <AppContainer>
                <div className="d-flex justify-content-around">
                    <button onClick={()=>fillArray(DEFAULT_SIZE)}>Generate New Array</button>
                    <SpeedSlider ms={ms} setMs={setMs} sleepState = {sleepState}/>
                    <div className="d-flex gap-2">
                        <button onClick={()=>bubbleSort()}>Bubble Sort</button>
                        <button onClick={()=>selectionSort()}>Selection Sort</button>
                        <button onClick={()=>bubbleSort()}>Merge Sort</button>
                        <button onClick={()=>heapAnimations()}>Heap Sort</button>
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
        </AppContainer>
    )
}

function getRandomArbitrary(min : number, max : number) : number{
    return Math.floor(Math.random() * (max - min) + min);
}