import { useEffect, useState } from "react"
import { AppContainer } from "../helper"
import { timeMonday } from "d3";

export const Matrix = () => {
    let [array , setArray] = useState<number[][]>([]);
    
    useEffect(() => {
        let arr = [];
        let j = 1;
        let temp : number[] = [];
        for(let i = 0; i < 25; i++){
            temp.push(j)
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
                                row.map((val, valIndex) => (
                                    <div 
                                    className = "matrixVal d-flex justify-content-center align-items-center"
                                    key = {valIndex}

                                    >
                                        {val}
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