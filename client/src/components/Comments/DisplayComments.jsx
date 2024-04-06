import { useStateContext } from '@/context';
import React, { useEffect, useState } from 'react'
import CommentCard from './CommentCard';
import { FormField, Loader } from '..';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { SendHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { MessageCircleOff } from 'lucide-react';

const DisplayComments = () => {
    const [comments, setComments] = useState([])
    const { getComments, addComment } = useStateContext();
    const [comment, setComment] = useState('')
    const [fetchAgain, setFetchAgain] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            const data = await getComments();
            setComments(data);
            setLoading(false)
        })()
    }, [fetchAgain])

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addComment(comment);
        setComment('')
        setFetchAgain(prev => !prev)
    }


    return (
        <>
            <Card className='mb-4'>
                <CardHeader>
                    <CardTitle>Comments</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className='w-[100%]' onSubmit={handleSubmit}>
                        <FormField
                            isTextArea={true}
                            name='comment'
                            label='Comment'
                            placeholder='Enter your comment here'
                            required
                            value={comment}
                            handleChange={(e) => setComment(e.target.value)}
                        />
                        <Button
                            type='submit'
                            className=' mt-4 bg-custom-primary hover:bg-custom-primary-dark text-white'
                        >
                            Comment
                            <SendHorizontal className='ml-3' size={20} />
                        </Button>
                    </form>
                </CardContent>
            </Card>
            {loading ? (
                <div className='p-5 flex justify-center items-center w-full'>
                    <Loader variant="inline" />
                </div>
            ) : (
                <>
                    {comments?.map((comment, index) => (
                        <div className='w-[100%]'>
                            <CommentCard key={index} commentData={comment} />
                        </div>
                    ))}

                    {comments.length === 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className='text-center'>No Comments!!</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='text-center'>No comments yet. Be the first to comment!</p>
                                <MessageCircleOff
                                    size={100}
                                    className='mx-auto my-4 text-custom-primary'
                                />
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </>
    )
}

export default DisplayComments