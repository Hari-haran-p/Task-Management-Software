import React from 'react';
import logo from "../assets/card-task.png";
import op from "../assets/option.svg";
import dot from "../assets/dots.png";

function Card() {
  return (
    <>
     <div className="h-screen bg-white w-full p-5">
        <div className='w-full max-w-sm  rounded-xl shadow-2xl'>
            <div className='w-full h-14 bg-white flex items-center justify-between pl-4 pr-4 rounded-t-xl'>
                <div className='flex gap-3 rounded-xl items-center p-3 h-9 justify-center bg-card min-sm:w-24 sm:h-9'>
                    <img src={logo} alt="" className='w-3 h-3'/>
                    <div className='text-sm font-bold text-red-text'>To Do</div>
                </div>
                <div>
                    <div className='flex gap-1 bg-F2EBFF rounded-xl items-center w-28 h-9 justify-center bg-card_1'>
                        <img src={dot} alt=""  className='h-3 w-3 text-orange-600 rounded-2xl'/>
                        <div className='text-sm font-bold text-orange-500'>Medium</div>
                    </div>
                </div>
                <div>
                    <button>
                        <img src={op} alt="" className='w-6 h-6'/>
                    </button>
                </div>
            </div>
            <div className='w-full flex flex-wrap items-center pl-5'>
                <div className='font-extrabold text-2xl'>Submit Weekly Report</div>
            </div>
            <div className='w-full h-24 pl-5 pt-2'>
                <div className='text-sm'>Prepare the weekly report that summarizes the progress of ongoing projects and tasks. Include key performance metrics ...</div>
            </div>
            <div className='w-full flex items-center  h-12 rounded-b-xl border-t-2 border-gray-300 pl-5 '>
                <div className='text-sm font-bold '>06/10/2024</div>
            </div>
        </div>
        
     </div>
    </>
  )
}

export default Card