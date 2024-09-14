'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'

type Field = {
  id: string,
  type: 'text' | 'number' | 'date' | 'file',
  label: string
}

export default function DynamicForm() {
  const [fields, setFields] = useState<Field[]>([])
  const [data, setData] = useState<string[]>([]) // Initialize as an array of strings
  const params = useParams();
  const id = params.id;

  const buildForm = async () => {
    try {
      const res = await fetch(`api/buildform?id=${id}`, {
        method: 'GET',
        cache: 'force-cache'
      });
      const res2 = await res.json();
      const formFields = res2.data[0].fields;

      setFields(formFields);
      setData(formFields.map(() => '')); // Initialize `data` with empty values matching fields length
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  }

  useEffect(() => {
    buildForm()
  }, [])

  const handleChange = (index: number, value: string) => {
    const updatedData = [...data];
    updatedData[index] = value;
    setData(updatedData);
  }

  const handleSubmit = async () => {
    try {
      await axios.post('/api/sendresponse', {
        data, _id: id
      });
      alert('Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  return (
    <div className="min-h-screen bg-[#000625] text-white">
      <header className="bg-[#000625] sticky top-0 shadow-md z-10">
        <h1 className="text-3xl font-bold text-center py-4">
          Form Builder
        </h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-[#001050] rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
          <div className="space-y-6">
            {fields.map((item, index) => (
              <div key={item.id} className="bg-[#0020a0] rounded-lg p-4 transition-all duration-300 hover:shadow-lg">
                <label
                  htmlFor={item.id}
                  className="block text-xl font-semibold mb-2 capitalize"
                >
                  {item.label}
                </label>
                <input
                  value={data[index]}
                  onChange={(e) => handleChange(index, e.target.value)} // Update data on change
                  id={item.id}
                  type={item.type}
                  placeholder={`Enter ${item.label.toLowerCase()}`}
                  className="w-full px-4 py-2 bg-[#000625] border-b-2 border-blue-400 rounded focus:outline-none focus:border-blue-500 transition-colors duration-300"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            Submit
          </button>
        </div>
      </main>
    </div>
  )
}
