'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

type field = {
  id: string,
  type: 'text' | 'number' | 'date' | 'file',
  label: string
}
const page = () => {
  const [fields, setFields] = useState<field[]>([])
  const [saved, setSaved] = useState(false)
  const [email, setEmail] = useState('')
  const [emailed, setEmailed] = useState(false)
  const [isopen, setIsopen] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedFields = localStorage.getItem('fields');
    if (storedFields) {
      setSaved(true)
      const f = JSON.parse(storedFields);
      setFields(f);
    }
  }, []);
  const addField = () => {
    setSaved(false)
    const newfield: field = {
      id: Date.now().toString(),
      type: 'text',
      label: `new text field`
    }
    setFields([...fields, newfield])
  }
  const selectType = (type: field['type'], index: number) => {
    setFields(fields.map((field, i) =>
      i === index ? { ...field, type } : field
    ));
    setIsopen('')
  };
  const removeField = (i: number) => {
    const x = confirm('do you want to remove?')
    if (x) {
      const newfield = fields.filter((item, index) => {
        return i !== index
      })
      setFields(newfield)
      localStorage.setItem('fields',JSON.stringify(newfield))
      setSaved(false)
    }
  }
  const addLabel = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const updatedFields = [...fields];
    updatedFields[i] = { ...updatedFields[i], label: e.target.value };
    setFields(updatedFields);
  };
  const save = () => {
    setSaved(true)
    localStorage.setItem('fields', JSON.stringify(fields))
    console.log(fields);
  }
  const generateForm = async () => {
    setLoading(true)
    const res = await axios.post('api/save', {
      email, fields
    })
    setEmailed(true)
    setLoading(false)
  }
  return (
    <div className='w-full flex items-center flex-col min-h-screen 
    bg-[#000625]'>
      <h1 className='w-full h-[60px] flex items-center justify-center 
      bg-[#000625] text-white sticky top-0 text-[30px] font-bold'>
          Form Builder
        </h1>
      <div className='w-[90%] border mt-[15px] rounded-md min-h-[160px] 
      max-h-[60vh]
       bg-white flex flex-col'>
        <div className='sticky top-[0px] mb-3 bg-white'>
          <h2 className='my-2 mx-5 mx text-[25px]'>Start Here...</h2>
          <button onClick={addField}
            className='w-[100px] p-1 mx-5 bg-black rounded text-white border'>Add Field
          </button>
        </div>
        <div id='fields' className='max-h-[50vh] overflow-scroll 
        overflow-x-hidden'>
          {fields.map((items, index) => (
            <div key={index} className='h-[70px] w-[90%] mx-5 mt-1 
            rounded flex justify-between items-center'>
              <input placeholder={`field no ${index} write label`}
                value={fields[index].label}
                onChange={(e) => addLabel(e, index)}
                type="text"
                className='text-[#000000af] text-[14px] border rounded 
                h-[38px] w-[45%] p-2 focus:outline-none'
              />
              <button
                onClick={() => setIsopen(isopen === index.toString() ? '' : index.toString())}
                className='text-[#000000af] text-[14px] w-[20%] h-[38px] 
                rounded border'>
                {items.type}
              </button>

              <button onClick={() => removeField(index)}
                className='h-[38px] w-[20%] px-2 text-[14px] text-white bg-red-700 rounded'>
                Remove
              </button>
              {isopen === index.toString() &&
                <div className='absolute z-50'>
                  <div className='fixed inset-0 bg-[#00000031]'
                    onClick={() => setIsopen('')}>
                  </div>
                  <div className='w-[100px] h-[150px] relative top-[100px] 
                  left-[200px] text-[#000000af] bg-white shadow-lg border flex-col 
                  rounded p-2 flex justify-between items-center z-1'>
                    <button onClick={() => selectType('text', index)}>text</button>
                    <button onClick={() => selectType('number', index)}>number</button>
                    <button onClick={() => selectType('file', index)}>file</button>
                    <button onClick={() => selectType('date', index)}>date</button>
                  </div>
                </div>
              }
            </div>
          ))}
        </div>
      </div>

      {!saved ? <button onClick={save}
        className='m-5 w-[90%] rounded sticky bottom-0 h-[50px] mt-3 
          bg-green-600 text-white'>
        Save
      </button> :
        (!emailed ?
          <div className='h-[70px] w-[90%] rounded justify-between items-center 
      bg-white m-5 flex sticky bottom-[0px]'>
            <input value={email} onChange={e => setEmail(e.target.value)}
              placeholder='Enter your email...' type='email'
              className='mx-5 focus:outline-none rounded border h-[40px] p-2 
          text-[15px] w-[50%]' />
            <button onClick={() => generateForm()}
              className='rounded bg-black text-white p-1 border w-[30%] h-[40px] 
          text-[13px] mr-5'>{loading?'Generating':'Generate Form Link'}</button>
          </div> : <>
            <div className=' absolute inset-0 bg-black opacity-70'></div>
            <div className='fixed bottom-[100px] w-[90%] rounded-md mt-5 min-h-[100px] bg-white flex 
            flex-col'>
              <h1 className='m-5'>
                Your form has been generated, Link has been sended to your email,
                check your email.
                <br />
                <span className='font-bold'> {email}</span></h1>
            </div>
          </>)}
    </div >
  )
}
export default page