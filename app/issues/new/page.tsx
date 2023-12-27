'use client'
import { Button, TextField, Callout, Text } from '@radix-ui/themes'
import React, { useState } from 'react'
import SimpleMDE from "react-simplemde-editor";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { data } from 'autoprefixer';
import { useRouter } from 'next/navigation';
import { zodResolver }  from "@hookform/resolvers/zod";
import { createIssueSchema } from '@/app/createIssueSchema';
import { z } from "zod";
import ErrorMessage from '@/app/component/ErrorMessage';

type IssueForm = z.infer<typeof createIssueSchema>

const NewIssuePage = () => {
  const router = useRouter();
  const {register, control, handleSubmit, formState: {errors}} = useForm<IssueForm>(
    {
      resolver: zodResolver(createIssueSchema)
    }
  );
  const [error, setError]= useState('');
  const onsubmit = handleSubmit(async(data) => {
    try {
      await axios.post('/api/issues',data)
      router.push('/issues')
      
    } catch (error) {
      console.log(error)
      setError('An unexpected error occured')
    }
    })

  return (
    <div className='max-w-xl'>
     {error && <Callout.Root color='red' className='mb-5'>
        <Callout.Text>
          {error}
        </Callout.Text>
     </Callout.Root>}
    <form 
    className='space-y-3' 
    onSubmit={onsubmit}>
      <TextField.Root>
        <TextField.Input placeholder='Title' {...register('title')} />
      </TextField.Root>
      <ErrorMessage>{errors.title?.message}</ErrorMessage>
      <Controller
      name='description'
      control = {control}
      render={({field})=><SimpleMDE placeholder='Description'{...field} />}
      />
    <ErrorMessage>{errors.description?.message}</ErrorMessage>
      <Button>Submit Issue</Button>
    </form>
    </div>
  )
}

export default NewIssuePage