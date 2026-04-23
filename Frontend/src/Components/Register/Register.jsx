import style from './Register.module.css'
import React, { useContext, useState } from 'react'
import cirlce from '../../../Images/circles.svg'
import { useFormik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext'

export default function Register () {
  const [role, setRole] = useState(null)
  let navigate = useNavigate()
  let [APIERR, setAPIERR] = useState(null)
  let [loadingSpinner, setloadingSpinner] = useState(false)
  // الـ imports والـ state نفسهم — بس غيّري registerForm للكود ده:

  let { setUserData, setUserName, setUserPhone, setUserID, setUserRole } = useContext(UserContext)

  async function registerForm (values) {
    try {
      setloadingSpinner(true)
      setAPIERR(null)
      let { data } = await axios.post(
        'http://localhost:9090/api/auth/register',
        values,
        { withCredentials: true }   // ✅ عشان الـ JWT cookie يتحفظ
      )
      setUserData(String(data.userId))  // ✅ مش data.token
      setUserName(data.name)            // ✅ مش data.fullName
      setUserPhone(data.phone)
      setUserID(data.userId)
      setUserRole(data.role)            // ✅ جديد

      if (role === 'doctor') navigate('/DoctorHome')
      else navigate('/')
      setloadingSpinner(false)
    } catch (err) {
      setAPIERR(err?.response?.data?.message || 'Error happened')
      setloadingSpinner(false)
    }
  }

  let validationSchema = yup.object().shape({
    name: yup
      .string()
      .min(4, 'min length is 3')
      .max(10, 'max length is 10')
      .required('the name is required'),
    email: yup.string().email('email is invalid').required('email is required'),
    password: yup
      .string()
      .required('password is required'),
    phone: yup
      .string()
      .matches(/^01[0-2,5]{1}[0-9]{8}$/, 'Invalid phone number')
      .required('phone is required')
  })

  let formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      phone: ''
    },
    validationSchema,
    onSubmit: registerForm
  })



  return (
    <>
      <section className='flex md:flex-row flex-col bg-[#F4F8FF] w-full overflow-hidden'>
        {/* LEFT SIDE */}
        <div className='left relative bg-[#3276BD] px-6 py-4 w-full'>
          <img
            src={cirlce}
            alt='circle img'
            className='right-0 absolute w-[200px] overflow-hidden'
          />

          <p className='my-4 font-semibold text-white text-3xl'>
            Your pet deserves{' '}
            <span className='text-[#46CEAC]'>the best care</span>
          </p>

          <p className='my-4 text-[#BFD1E5]'>
            Sign in to manage appointments, records, and connect with our expert
            veterinary team.
          </p>

          {/* boxes */}
          <div className='flex flex-col gap-2 boxes'>
            <div className='bg-[#2e598a] my-2 px-2 py-2 rounded-3xl text-white'>
              <p>Book and manage appointments online</p>
            </div>
            <div className='bg-[#2e598a] my-2 px-2 py-2 rounded-3xl text-white'>
              <p>View medical records and prescriptions</p>
            </div>
            <div className='bg-[#2e598a] my-2 px-2 py-2 rounded-3xl text-white'>
              <p>Secure messaging with your vet</p>
            </div>
            <div className='bg-[#2e598a] my-2 px-2 py-2 rounded-3xl text-white'>
              <p>24/7 emergency support access</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className='right bg-[#F4F8FF] px-6 py-4 rounded-3xl w-full'>
          <p className='my-4 font-bold text-black text-3xl'>
            Create your account
          </p>

          <p className='font-semibold text-[#4A6580]'>
            Select your role to continue
          </p>

          <p className='my-6 font-semibold text-[#4A6580]'>I am a ...</p>

          {/* ROLE SELECTOR */}
          <div className='flex flex-row gap-2'>
            {/* PATIENT */}
            <div
              onClick={() => setRole('patient')}
              className={`flex flex-col justify-center items-center bg-[#FFFFFF] p-2 rounded-3xl hover:cursor-pointer transition ${
                role === 'patient'
                  ? 'border-2 border-[#4DD0AF] bg-[#E6FAF5]'
                  : ''
              }`}
            >
              <div className='bg-[#C6F1E6] px-4 py-2 rounded-xl text-center'>
                🐾
              </div>
              <p className='flex items-center gap-2 my-2 font-bold text-2xl'>
                Patient
                {role === 'patient' && (
                  <span className='text-green-500'>✔</span>
                )}
              </p>
              <p className='text-[#535353] text-center'>
                Pet owner looking for care
              </p>
            </div>

            {/* DOCTOR */}
            <div
              onClick={() => setRole('doctor')}
              className={`flex flex-col justify-center items-center bg-[#FFFFFF] hover:bg-[#E8F1FB] p-2 rounded-3xl hover:cursor-pointer transition ${
                role === 'doctor' ? 'border-2 border-[#5badfe]' : ''
              }`}
            >
              <div className='bg-[#C6F1E6] px-4 py-2 rounded-xl text-center'>
                🩺
              </div>
              <p className='flex items-center gap-2 my-2 font-bold text-2xl'>
                Doctor
                {role === 'doctor' && <span className='text-green-500'>✔</span>}
              </p>
              <p className='text-[#535353] text-center'>
                Veterinary doctor account
              </p>
            </div>
          </div>

          {/* CONDITIONAL ALERTS */}
          {role === 'doctor' && (
            <div className='gap-2 bg-[#E8F1FB] my-4 px-4 py-2 border border-[#B5D4F4] rounded-xl'>
              <div className='flex flex-row gap-2 mb-3'>
                <i className='fa-solid fa-check'></i>
                <p className='font-bold text-[#5badfe] text-[14px]'>
                  Signing in as a Veterinary Doctor — additional verification
                  required
                </p>
              </div>
              <form
                onSubmit={formik.handleSubmit}
                className='flex flex-col gap-3'
              >
                {/* API Error */}
                {APIERR && (
                  <div className='bg-red-100 px-3 py-2 border border-red-400 rounded-lg text-red-600 text-sm'>
                    {APIERR}
                  </div>
                )}

                {/* Full Name */}
                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='name'
                    className='font-semibold text-[#4A6580] text-sm'
                  >
                    Full Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    placeholder='Enter your full name'
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`bg-white px-3 py-2 border rounded-xl outline-none text-sm transition focus:ring-2 focus:ring-[#4DD0AF] ${
                      formik.touched.name && formik.errors.name
                        ? 'border-red-400'
                        : 'border-[#C5D8EE]'
                    }`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className='text-red-500 text-xs'>
                      {formik.errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='email'
                    className='font-semibold text-[#4A6580] text-sm'
                  >
                    Email
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    placeholder='Enter your email'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`bg-white px-3 py-2 border rounded-xl outline-none text-sm transition focus:ring-2 focus:ring-[#4DD0AF] ${
                      formik.touched.email && formik.errors.email
                        ? 'border-red-400'
                        : 'border-[#C5D8EE]'
                    }`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className='text-red-500 text-xs'>
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='password'
                    className='font-semibold text-[#4A6580] text-sm'
                  >
                    Password
                  </label>
                  <input
                    type='password'
                    id='password'
                    name='password'
                    placeholder='Enter your password'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`bg-white px-3 py-2 border rounded-xl outline-none text-sm transition focus:ring-2 focus:ring-[#4DD0AF] ${
                      formik.touched.password && formik.errors.password
                        ? 'border-red-400'
                        : 'border-[#C5D8EE]'
                    }`}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className='text-red-500 text-xs'>
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='phone'
                    className='font-semibold text-[#4A6580] text-sm'
                  >
                    Phone
                  </label>
                  <input
                    type='tel'
                    id='phone'
                    name='phone'
                    placeholder='01XXXXXXXXX'
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`bg-white px-3 py-2 border rounded-xl outline-none text-sm transition focus:ring-2 focus:ring-[#4DD0AF] ${
                      formik.touched.phone && formik.errors.phone
                        ? 'border-red-400'
                        : 'border-[#C5D8EE]'
                    }`}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className='text-red-500 text-xs'>
                      {formik.errors.phone}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={loadingSpinner}
                  className='flex justify-center items-center bg-[#5badfe] hover:bg-[#43a1ff] disabled:opacity-60 mt-2 py-2 rounded-xl font-bold text-white transition'
                >
                  {loadingSpinner ? (
                    <i className='fa-solid fa-spinner fa-spin'></i>
                  ) : (
                    'Register'
                  )}
                </button>

                <p className='my-4 font-bold text-[#4A6580] text-center'>
                  have an account?
                  <Link
                    to={'/Login'}
                    className='text-[#5badfe] hover:text-[#80bfff]'
                  >
                    Log in
                  </Link>
                </p>
              </form>
            </div>
          )}

          {role === 'patient' && (
            <div className='bg-[#E6FAF5] my-4 px-4 py-3 border border-[#4DD0AF] rounded-xl'>
              <div className='flex flex-row gap-2 mb-3'>
                <i className='text-[#0F6E56] fa-regular fa-heart'></i>
                <p className='font-bold text-[#0F6E56] text-[14px]'>
                  Signing in as a Pet Owner — access appointments & pet records
                </p>
              </div>

              {/* FORM */}
              <form
                onSubmit={formik.handleSubmit}
                className='flex flex-col gap-3'
              >
                {/* API Error */}
                {APIERR && (
                  <div className='bg-red-100 px-3 py-2 border border-red-400 rounded-lg text-red-600 text-sm'>
                    {APIERR}
                  </div>
                )}

                {/* Full Name */}
                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='name'
                    className='font-semibold text-[#4A6580] text-sm'
                  >
                    Full Name
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    placeholder='Enter your full name'
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`bg-white px-3 py-2 border rounded-xl outline-none text-sm transition focus:ring-2 focus:ring-[#4DD0AF] ${
                      formik.touched.name && formik.errors.name
                        ? 'border-red-400'
                        : 'border-[#C5D8EE]'
                    }`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className='text-red-500 text-xs'>
                      {formik.errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='email'
                    className='font-semibold text-[#4A6580] text-sm'
                  >
                    Email
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    placeholder='Enter your email'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`bg-white px-3 py-2 border rounded-xl outline-none text-sm transition focus:ring-2 focus:ring-[#4DD0AF] ${
                      formik.touched.email && formik.errors.email
                        ? 'border-red-400'
                        : 'border-[#C5D8EE]'
                    }`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className='text-red-500 text-xs'>
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='password'
                    className='font-semibold text-[#4A6580] text-sm'
                  >
                    Password
                  </label>
                  <input
                    type='password'
                    id='password'
                    name='password'
                    placeholder='Enter your password'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`bg-white px-3 py-2 border rounded-xl outline-none text-sm transition focus:ring-2 focus:ring-[#4DD0AF] ${
                      formik.touched.password && formik.errors.password
                        ? 'border-red-400'
                        : 'border-[#C5D8EE]'
                    }`}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className='text-red-500 text-xs'>
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='phone'
                    className='font-semibold text-[#4A6580] text-sm'
                  >
                    Phone
                  </label>
                  <input
                    type='tel'
                    id='phone'
                    name='phone'
                    placeholder='01XXXXXXXXX'
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`bg-white px-3 py-2 border rounded-xl outline-none text-sm transition focus:ring-2 focus:ring-[#4DD0AF] ${
                      formik.touched.phone && formik.errors.phone
                        ? 'border-red-400'
                        : 'border-[#C5D8EE]'
                    }`}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className='text-red-500 text-xs'>
                      {formik.errors.phone}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={loadingSpinner}
                  className='flex justify-center items-center bg-[#4DD0AF] hover:bg-[#3ab99a] disabled:opacity-60 mt-2 py-2 rounded-xl font-bold text-white transition'
                >
                  {loadingSpinner ? (
                    <i className='fa-solid fa-spinner fa-spin'></i>
                  ) : (
                    'Register'
                  )}
                </button>

                <p className='my-4 font-bold text-[#4A6580] text-center'>
                  have an account?
                  <Link
                    to={'/Login'}
                    className='text-[#4DD0AF] hover:text-[#3ab99a]'
                  >
                    Log in
                  </Link>
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
