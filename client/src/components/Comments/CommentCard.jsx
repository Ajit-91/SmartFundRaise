import { metamask } from '@/assets'
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"
import RenderLargeText from '../RenderLargeText'

const CommentCard = ({ commentData }) => {
    const { commenter, date, comment } = commentData

    return (
        <>
            <Card className="mb-4">
                <CardHeader className="flex flex-row gap-5">
                    <div className="max-w-[52px] max-h-[52px] min-w-[52px] min-h-[52px] flex items-center justify-center rounded-full bg-[#f0f2f5] dark:bg-[#2c2f32] cursor-pointer">
                        <img src={metamask} alt="user" className="w-[60%] h-[60%] object-contain" />
                    </div>
                    <div className='' >
                        <CardDescription className="font-bold break-all ">{commenter}</CardDescription>
                        <p className='text-sm' >{new Date(date).toDateString()}</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <CardDescription>
                    <RenderLargeText text={comment} />
                    </CardDescription>
                </CardContent>
            </Card>
        </>
    )
}

export default CommentCard