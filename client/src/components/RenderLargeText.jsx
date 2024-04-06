import React, { useState } from 'react'

const RenderLargeText = ({ text }) => {
    const [isSliced, setIsSliced] = useState(text.length > 280)

    return (
        <>
            {isSliced ? (
                <>
                    <p className='text-justify inline' >{text.slice(0, 280)}</p>
                    <span
                        onClick={() => setIsSliced(false)}
                        className='text-custom-primary cursor-pointer ml-1'
                    >
                        ...Read more
                    </span>
                </>
            ) : (
                <p className='text-justify' >{text}</p>
            )}

            {(!isSliced && text.length > 280) && (
                <span
                    onClick={() => setIsSliced(true)}
                    className='text-custom-primary cursor-pointer'
                >
                    Read less
                </span>
            )}
        </>
    )
}

export default RenderLargeText