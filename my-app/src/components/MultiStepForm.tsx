import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import PhoneField from './PhoneField';

const MultiStepForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [geolocationStatus, setGeolocationStatus] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const navigate=useNavigate()
  // Step 1: Basic Details
  const basicDetailsSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.number().required('Phone number is required'),
  });

  // Step 2: Address
  const addressSchema = Yup.object().shape({
    addressLine1: Yup.string().required('Address line 1 is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    pincode: Yup.string().required('Pincode is required'),
    country: Yup.string().required('Country is required'),
  });

  // Step 3: File Upload
  const fileUploadSchema = Yup.object().shape({
    file: Yup.mixed().required('File is required').test('fileType', 'Invalid file type', (value:any) => {
      if (!value) return true;
      return value.type === 'image/png' || value.type === 'application/pdf';
    }),
  });

  // Step 4: Multi File Upload
  const multiFileUploadSchema = Yup.object().shape({
    multiFiles: Yup.array()
      .min(1, 'Please upload at least one file')
      .test('fileType', 'Invalid file type', (values) => {
        if (!values) return true;
        for (const file of values) {
          if (file.type !== 'image/png' && file.type !== 'application/pdf') {
            return false;
          }
        }
        return true;
      }),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      country: '',
      file: null,
      multiFiles: [],
    },
    validationSchema:
      step === 1
        ? basicDetailsSchema
        : step === 2
        ? addressSchema
        : step === 3
        ? fileUploadSchema
        : step === 4
        ? multiFileUploadSchema
        : null,
    onSubmit: ():any => {
      if (step === 5) {
        // Submit the form data to the server
      
        setStep(1);
        setGeolocationStatus(false);
        setFormSubmitted(true);
        formik.resetForm();
        navigate("/")
      } else {
        setStep(step + 1);
      }
    },
  });

  const handlePrevious = (): void => {
    setStep(step - 1);
  };

  const getLocation = (): void => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Latitude:', position.coords.latitude);
          console.log('Longitude:', position.coords.longitude);
          setGeolocationStatus(true);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className={`mx-auto p-4 bg-gradient-to-r from-purple-500 to-pink-500 h-[120vh]`}>
      <h1 className="text-2xl font-bold mb-4 text-white">Multi-Step Form</h1>
      <div>
        {/* Progress Bar */}
        <div className="text-center mb-4 text-white font-semibold text-xl">
          Step {step} of 5
        </div>

        {/* Step 1: Basic Details */}
        {step === 1 && (
          <form onSubmit={formik.handleSubmit}>
            <h2 className="text-lg font-semibold mb-4 text-white">Step 1: Basic Details</h2>
            <label className="block mb-2 text-white">Name:</label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border ${
                formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-violet-400 w-[50%]`}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm mb-2">{formik.errors.name}</div>
            )}
            <label className="block mb-2 text-white">Email:</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border ${
                formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-violet-400 w-[50%]`}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mb-2">{formik.errors.email}</div>
            )}
           <div className='flex items-center w-100 overflow-y-hidden  '>
           <PhoneField />
          <div>
          <label className="block mb-2 text-white">Phone Number:</label>
            <input
              type="tel"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border ${
                formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 rounded mb-2 focus:outline-none focus:ring-2 mx-2 focus:ring-blue-400 w-[200%]`}
            />
          </div>
         
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-red-500 text-sm mb-2">{formik.errors.phone}</div>
            )}
           </div>
            <button
              type="submit"
              className=" bg-violet-900 text-white  hover:bg-violet-950 my-10 px-4 py-2 rounded"
            >
              Next
            </button>
          </form>
        )}

        {/* Step 2: Address */}
        {step === 2 && (
          <form onSubmit={formik.handleSubmit} className='flex-col items-center w-[100%] '>
            <h2 className="text-lg font-semibold mb-4 text-white">Step 2: Address</h2>
            <label className="block mb-2 text-white">Address Line 1:</label>
            <input
              type="text"
              name="addressLine1"
              value={formik.values.addressLine1}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border ${
                formik.touched.addressLine1 && formik.errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-[70%]`}
            />
            {formik.touched.addressLine1 && formik.errors.addressLine1 && (
              <div className="text-red-500 text-sm mb-2">{formik.errors.addressLine1}</div>
            )}
            <label className="block mb-2 text-white">Address Line 2:</label>
            <input
              type="text"
              name="addressLine2"
              value={formik.values.addressLine2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border ${
                formik.touched.addressLine2 && formik.errors.addressLine2 ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-[70%]`}
            />
            {formik.touched.addressLine2 && formik.errors.addressLine2 && (
              <div className="text-red-500 text-sm mb-2">{formik.errors.addressLine2}</div>
            )}
            <label className="block mb-2  text-white">City:</label>
            <input
              type="text"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border ${
                formik.touched.city && formik.errors.city ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-[30%]`}
            />
            {formik.touched.city && formik.errors.city && (
              <div className="text-red-500 text-sm mb-2">{formik.errors.city}</div>
            )}
            <label className="block mb-2  text-white">State:</label>
            <input
              type="text"
              name="state"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border ${
                formik.touched.state && formik.errors.state ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-[30%]`}
            />
            {formik.touched.state && formik.errors.state && (
              <div className="text-red-500 text-sm mb-2">{formik.errors.state}</div>
            )}
            <label className="block mb-2  text-white">Pincode:</label>
            <input
              type="text"
              name="pincode"
              value={formik.values.pincode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border ${
                formik.touched.pincode && formik.errors.pincode ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-[30%]`}
            />
            {formik.touched.pincode && formik.errors.pincode && (
              <div className="text-red-500 text-sm mb-2">{formik.errors.pincode}</div>
            )}
            <label className="block mb-2  text-white">Country:</label>
            <input
              type="text"
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border ${
                formik.touched.country && formik.errors.country ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 rounded mb-2 focus:outline-none focus:ring-2focus:ring-blue-400 w-[30%]`}
            />
            {formik.touched.country && formik.errors.country && (
              <div className="text-red-500 text-sm mb-2">{formik.errors.country}</div>
            )}
           <div>
           <button
              type="button"
              onClick={handlePrevious}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Previous
            </button>
            <button
              type="submit"
              className=" bg-violet-900 text-white  hover:bg-violet-950 px-4 py-2 rounded ml-2"
            >
              Next
            </button>
           </div>
          </form>
        )}

        {/* Step 3: File Upload */}
        {step === 3 && (
          <form onSubmit={formik.handleSubmit}>
            <h2 className="text-lg font-semibold mb-4">Step 3: File Upload</h2>
            <label className="block mb-2">Upload a PNG or PDF file:</label>
            <input
              type="file"
              name="file"
              onChange={(event) => {
                formik.setFieldValue('file', event.currentTarget.files?.[0]);
              }}
              onBlur={formik.handleBlur}
              className={`mb-2 ${
                formik.touched.file && formik.errors.file ? 'border-red-500' : ''
              }`}
            />
            {formik.touched.file && formik.errors.file && (
              <div className="text-red-500 text-sm mb-2">{formik.errors.file}</div>
            )}
            <button
              type="button"
              onClick={handlePrevious}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Previous
            </button>
            <button
              type="submit"
              className=" bg-violet-900 text-white  hover:bg-violet-950 px-4 py-2 rounded ml-2"
            >
              Next
            </button>
          </form>
        )}

        {/* Step 4: Multi File Upload */}
        {step === 4 && (
          <form onSubmit={formik.handleSubmit}>
            <h2 className="text-lg font-semibold mb-4">Step 4: Multi File Upload</h2>
            <label className="block mb-2">Upload PNG or PDF files (up to 5 files):</label>
            <input
              type="file"
              name="multiFiles"
              multiple
              onChange={(event) => {
                formik.setFieldValue('multiFiles', Array.from(event.currentTarget.files || []));
              }}
              onBlur={formik.handleBlur}
              className={`mb-2 ${
                formik.touched.multiFiles && formik.errors.multiFiles ? 'border-red-500' : ''
              }`}
            />
            {formik.touched.multiFiles && formik.errors.multiFiles && (
              <div className="text-red-500 text-sm mb-2">{formik.errors.multiFiles}</div>
            )}
            <button
              type="button"
              onClick={handlePrevious}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Previous
            </button>
            <button
              type="submit"
              className=" bg-violet-900 text-white  hover:bg-violet-950 px-4 py-2 rounded ml-2"
            >
              Next
            </button>
            <br />
            <button
              type="button"
              onClick={getLocation}
              className=" bg-violet-900 text-white rounded hover:bg-violet-950 px-4 py-2 rounded mt-2"
            >
              Get Geolocation
            </button>
            {geolocationStatus && (
              <p className="text-green-600">Geolocation captured successfully!</p>
            )}
          </form>
        )}

        {/* Step 5: Status */}
        {step === 5 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Step 5: Status</h2>
            {formSubmitted ? (
              <p className="text-green-600">Form Submitted successfully!</p>
            ) : (
              <p>Form has not been submitted yet.</p>
            )}
            <button
              type="button"
              onClick={handlePrevious}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Previous
            </button>
            <button
              type="submit"
              onClick={()=>{formik.handleSubmit()}}
              className=" bg-violet-900 text-white hover:bg-violet-950 px-4 py-2 rounded ml-2"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
