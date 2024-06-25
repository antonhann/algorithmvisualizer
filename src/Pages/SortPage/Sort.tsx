import React, { useEffect, useState } from "react"
import { Footer, NavBar, Sections } from "../../Navbar/Navbar"

const DEFAULT_SIZE : number = 50;

enum Color{
    defaultColor = "black",
    highlightColor = "blue",
    swapColor = "red",
}

class Block{
    value : number;
    height : number;
    color: Color;
    constructor(value : number){
        this.value = value;
        this.height = value * 6;
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
        <div className="app-container">
            <NavBar active={Sections.Sorting}/>
            <section className="main-container">
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