import React, { useEffect, useState } from "react"
import { NavBar, Sections } from "../../Navbar/Navbar"

const DEFAULT_SIZE : number = 50;

enum Color{
    defaultColor,
    highlightColor,
    swapColor
}

class Block{
    value : number;
    height : number;
    color: Color;
    constructor(value : number){
        this.value = value;
        this.height = calculateHeight(value);
        this.color = Color.defaultColor;
    }
};

export const Sort = () => {
    const [array, setArray] = useState<Block[]>([]);

    const fillArray = (size : number) : void => {
        let newArray : Block[] = [];
        let inside : Set<number> = new Set<number>();

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


    useEffect(()=>{
        fillArray(DEFAULT_SIZE);
    },[]);
    return(
        <>
        <NavBar active={Sections.Sorting}/>
        <section>
            <div className="d-flex justify-content-center gap-1">
                {array.map(block => (
                    <div key = {block.value}>{block.value}</div>
                ))}
            </div>
        </section>
        </>
    )
}

function calculateHeight (value : number) : number{
    return value;
}   
function getRandomArbitrary(min : number, max : number) : number{
    return Math.floor(Math.random() * (max - min) + min);
}