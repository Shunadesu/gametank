import React, { useState } from 'react'

const Box = ({isShow, setIsShow}) => {

    const [isShowTheLe, setIsShowTheLe] = useState(false)

  return (
    <div className='flex justify-center items-center w-full h-full'>
            {
                isShowTheLe ?
                <div className='absolute flex justify-center items-center bg-white shadow-2xl'> 
                    <div className='relative w-[300px] h-[300px] flex flex-col p-4 border rounded-2xl z-100'>
                        <div 
                        onClick={() => setIsShowTheLe(!isShowTheLe)}
                        className='absolute top-3 right-3 cursor-pointer border rounded-[100%] px-2 py-1 flex items-center justify-center hover:opacity-75 hover:bg-amber-200 transition-all 0.3s ease-in'>
                            x
                        </div>

                       <div className='flex flex-col justify-center items-center'>
                            <div className='text-[22px]'>The le</div>
                            <div className='flex flex-col gap-2'>
                                <p>
                                - Choi game nhan qua ...
                                </p>
                                <p>
                                - 100 Diem : voucher ...
                                </p>
                                <p>
                                - 200 Diem: voucher ...
                                </p>
                            </div>
                       </div>
                    </div>
                </div>
                :
                null
            }
        <div className='w-full h-full flex flex-col gap-4 justify-center items-center px-16'> 
            
            <div className='w-full flex justify-center'>
                <div 
                onClick={() => setIsShowTheLe(!isShowTheLe)} 
                className='rounded-2xl border p-4 cursor-pointer'>
                    The le
                </div>
            </div>

            <div 
            onClick={() => setIsShow(!isShow)}
            className='cursor-pointer flex justify-center items-center border w-full h-[20vh] shadow-2xl'>
                Sieu sale dai le, choi game lay voucher
            </div>
        </div>
    </div>
  )
}

export default Box