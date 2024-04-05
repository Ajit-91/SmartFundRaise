import { metamask } from '@/assets'
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"

const CommentCard = ({ commentData }) => {
    const { commenter, date, comment } = commentData
    const [isSliced, setIsSliced] = useState(comment.length > 280)

    return (
        <>
            <Card className="mb-4">
                <CardHeader className="flex flex-row gap-5">
                    <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#f0f2f5] dark:bg-[#2c2f32] cursor-pointer">
                        <img src={metamask} alt="user" className="w-[60%] h-[60%] object-contain" />
                    </div>
                    <div className='' >
                        <CardDescription className="font-bold">{commenter}</CardDescription>
                        <CardDescription>{new Date(date).toDateString()}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {isSliced ? (
                        <>
                            <p className='text-justify inline' >{comment.slice(0, 280)}</p>
                            <span
                                onClick={() => setIsSliced(false)}
                                className='text-custom-primary cursor-pointer ml-1'
                            >
                                ...Read more
                            </span>
                        </>
                    ) : (
                        <p className='text-justify' >{comment}</p>
                    )}

                    {(!isSliced && comment.length > 280) && (
                        <span
                            onClick={() => setIsSliced(true)}
                            className='text-custom-primary cursor-pointer'
                        >
                            Read less
                        </span>
                    )}
                </CardContent>
            </Card>
        </>
    )
}

export default CommentCard