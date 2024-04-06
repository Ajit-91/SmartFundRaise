import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useStateContext } from '../context';
import { FormField } from '../components';
import { checkIfValidUrl } from '../utils';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { createCampaign } = useStateContext();
  const { toast } = useToast()
  const [form, setForm] = useState({
    title: '',
    description: '',
    target: '', 
    deadline: '',
    image: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!checkIfValidUrl(form.image)) {
      toast({
        variant: "destructive", 
        title: "Validation Error",
        description: "Please provide a valid image URL.",
      })
      setForm({ ...form, image: '' });
      return;
    } 
    try {
      await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18)})
      navigate('/profile');
    } catch (error) {
      console.log("Error creating campaign", error)
    }
  }

  return (
    <div className="bg-white dark:bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#f0f2f5] dark:bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-gray-500 dark:text-white">Start a Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
          <FormField 
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
      
        <FormField 
            labelName="Story *"
            placeholder="Write your story"
            isTextArea
            value={form.description}
            handleChange={(e) => handleFormFieldChange('description', e)}
          />

        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />
          <FormField 
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          />
        </div>

        <FormField 
            labelName="Campaign image *"
            placeholder="Place image URL of your campaign"
            inputType="url"
            value={form.image}
            handleChange={(e) => handleFormFieldChange('image', e)}
          />

          <div className="flex justify-center items-center mt-[40px]">
            <Button
              className="bg-custom-primary hover:bg-custom-primary-dark text-white"
            >
              <Send size={20} className='mr-3' />
              Submit new campaign
            </Button>
          </div>
      </form>
    </div>
  )
}

export default CreateCampaign