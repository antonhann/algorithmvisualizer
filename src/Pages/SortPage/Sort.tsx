import React, { useEffect, useState } from "react"
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
    const [array, setArray] = useState<Block[]>([]);
    const [sorted, setSorted] = useState<boolean>(false);
    const fillArray = (size : number) : void => {
        let newArray : Block[] = [];
        let inside : Set<number> = new Set<number>();
        setSorted(false);

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

    const sleep = (ms : number) => new Promise(resolve => setTimeout(resolve, ms));
    const updateArray = async (newArray : Block[], time : number) => {
        setArray([...newArray]);
        await sleep(time);
    }
    const bubbleSort = async () : Promise<void> => {
        let copyArray : Block[] = [...array];
        let slept : number = 10;

        for(let i : number = 0; i < copyArray.length; i++){
            setSorted(true);
            for(let j : number = 0; j < copyArray.length - i - 1; j++){
                copyArray[j].color = Color.highlightColor;
                copyArray[j+1].color = Color.highlightColor;
                await updateArray(copyArray, slept);
                if(copyArray[j].value > copyArray[j+1].value){
                    setSorted(false);
                    copyArray[j].color = Color.swapColor;
                    copyArray[j+1].color = Color.swapColor;
                    await updateArray(copyArray, slept);
                    let temp : Block = copyArray[j];
                    copyArray[j] = copyArray[j+1];
                    copyArray[j+1] = temp;
                    await updateArray(copyArray, slept);
                }
                copyArray[j].color = Color.defaultColor;
                copyArray[j+1].color = Color.defaultColor;
            }
            copyArray[copyArray.length - i - 1].color = Color.sortedColor;
            if(sorted){
                break;
            }
        }
        finishAnimation(copyArray,slept);
    }

    const finishAnimation = async (arr : Block[], slept : number) : Promise<void> => {
        
        console.log("Animation Done");
        let copyArray : Block[] = [...arr];
        for(let i : number = 0; i < copyArray.length; i++){
            copyArray[i].color = Color.doneColor;
            await updateArray(copyArray, slept);
        }
    }

    useEffect(()=>{
        fillArray(DEFAULT_SIZE);
    },[]);
    return(
        <div className="app-container">
            <NavBar active={Sections.Sorting}/>
            <section className="main-container">
                <div className="d-flex justify-content-around">
                    <button onClick={()=>fillArray(DEFAULT_SIZE)}>Generate New Array</button>
                    <div className="d-flex gap-2">
                        <button onClick={()=>bubbleSort()}>Bubble Sort</button>
                        <button onClick={()=>bubbleSort()}>Selection Sort</button>
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