import style from './Login.module.css'
import React, { useContext, useState } from 'react'
import cirlce from '../../../Images/circles.svg'
import { useFormik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext'

export default function Login () {
  const [role, setRole] = useState(null)
  let navigate = useNavigate()
  let [APIERR, setAPIERR] = useState(null)
  let [loadingSpinner, setloadingSpinner] = useState(false)
  let { setUserData, setUserName, setUserPhone, setUserID, setUserRole } = useContext(UserContext)

  let validationSchema = yup.object().shape({
    email: yup.string().email('email is invalid').required('email is required'),
    // ✅ للـ login بس NotBlank — مش بنتحقق من format
    password: yup.string().min(1).required('password is required')
  })

  let formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: loginForm
  })

  async function loginForm (values) {
    try {
      setloadingSpinner(true)
      setAPIERR(null)
      let { data } = await axios.post(
        'http://localhost:9090/api/auth/login',
        values,
        { withCredentials: true }
      )
      // ✅ JWT في httpOnly cookie — بنحفظ userId كـ proof
      setUserData(String(data.userId))
      setUserName(data.name)
      setUserPhone(data.phone)
      setUserID(data.userId)
      setUserRole(data.role)
      // بعد setUserRole(data.role) وقبل navigate
      // ✅ FIX: تحقق إن الـ role المختار يتطابق مع الـ role الفعلي
      const roleMap = {
        'patient': 'PET_OWNER',
        'doctor': 'VET',
        'admin': 'ADMIN',
        'receptionist': 'RECEPTIONIST'
      }
      if (roleMap[role] && roleMap[role] !== data.role) {
        setAPIERR(`Access denied. Your account role is ${data.role}, not ${role}.`)
        // امسح الـ state
        setUserData(null); setUserName(null); setUserPhone(null)
        setUserID(null); setUserRole(null)
        setloadingSpinner(false)
        return
      }

      if (data.role === 'ADMIN')             navigate('/admin')
      else if (data.role === 'VET')          navigate('/DoctorHome')
      else if (data.role === 'RECEPTIONIST') navigate('/receptionist')  // ← جديد
      else                                   navigate('/')

      setloadingSpinner(false)
    } catch (err) {
      setAPIERR(err?.response?.data?.message || 'Invalid credentials')
      setloadingSpinner(false)
    }
  }

  const roleCards = [
    { key: 'patient', icon: '🐾', label: 'Patient',  desc: 'Pet owner looking for care',  border: 'border-[#4DD0AF]', bg: 'bg-[#E6FAF5]',  iconBg: 'bg-[#C6F1E6]' },
    { key: 'doctor',  icon: '🩺', label: 'Doctor',   desc: 'Veterinary doctor account',   border: 'border-[#5badfe]', bg: 'bg-[#E8F1FB]',  iconBg: 'bg-[#C6E8FF]' },
    { key: 'admin',   icon: '🛡️', label: 'Admin',    desc: 'System administrator',        border: 'border-[#FF9800]', bg: 'bg-[#FFF3E0]',  iconBg: 'bg-[#FFE0B2]' },
    {
          key: 'receptionist',
          icon: '🗂️',
          label: 'Receptionist',
          desc: 'Clinic front desk staff',
          border: 'border-[#3276BD]',
          bg: 'bg-[#F0F7FF]',
          iconBg: 'bg-[#D1E5FF]'
        }
  ]


  const activeCard = roleCards.find(r => r.key === role)


  return (
    <>
      <section className='flex md:flex-row flex-col bg-[#F4F8FF] w-full overflow-hidden'>
        <div className='left relative bg-[#3276BD] px-6 py-4 w-full'>
          <img src={cirlce} alt='' className='right-0 absolute w-[200px] overflow-hidden' />
          <p className='my-4 font-semibold text-white text-3xl'>Your pet deserves <span className='text-[#46CEAC]'>the best care</span></p>
          <p className='my-4 text-[#BFD1E5]'>Sign in to manage appointments, records, and connect with our expert veterinary team.</p>
          {['Book and manage appointments online','View medical records and prescriptions','Secure messaging with your vet','24/7 emergency support access'].map(t => (
            <div key={t} className='bg-[#2e598a] my-2 px-2 py-2 rounded-3xl text-white'><p>{t}</p></div>
          ))}
        </div>

        <div className='right bg-[#F4F8FF] px-6 py-4 rounded-3xl w-full'>
          <p className='my-4 font-bold text-black text-3xl'>Welcome back</p>
          <p className='my-4 font-semibold text-[#4A6580]'>I am a ...</p>

          <div className='flex flex-row gap-2 flex-wrap'>
            {roleCards.map(r => (
              <div key={r.key} onClick={() => setRole(r.key)}
                className={`flex flex-col justify-center items-center bg-white p-2 rounded-3xl cursor-pointer transition
                  ${role === r.key ? `border-2 ${r.border} ${r.bg}` : 'hover:bg-gray-50'}`}>
                <div className={`${r.iconBg} px-4 py-2 rounded-xl text-center`}>{r.icon}</div>
                <p className='flex items-center gap-2 my-2 font-bold text-xl'>
                  {r.label} {role === r.key && <span className='text-green-500'>✔</span>}
                </p>
                <p className='text-[#535353] text-center text-sm'>{r.desc}</p>
              </div>
            ))}
          </div>

          {role && (
            <div className={`my-4 px-4 py-3 border rounded-xl ${activeCard?.bg} border-current`}
              style={{ borderColor: activeCard?.border.replace('border-[','').replace(']','') }}>
              <form onSubmit={formik.handleSubmit} className='flex flex-col gap-3'>
                {APIERR && <div className='bg-red-100 px-3 py-2 border border-red-400 rounded-lg text-red-600 text-sm'>{APIERR}</div>}
                {['email','password'].map(field => (
                  <div key={field} className='flex flex-col gap-1'>
                    <label className='font-semibold text-[#4A6580] text-sm capitalize'>{field}</label>
                    <input type={field} name={field} placeholder={`Enter your ${field}`}
                      value={formik.values[field]} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      className={`bg-white px-3 py-2 border rounded-xl outline-none text-sm transition focus:ring-2 focus:ring-[#4DD0AF]
                        ${formik.touched[field] && formik.errors[field] ? 'border-red-400' : 'border-[#C5D8EE]'}`} />
                    {formik.touched[field] && formik.errors[field] && <p className='text-red-500 text-xs'>{formik.errors[field]}</p>}
                  </div>
                ))}
                <button type='submit' disabled={loadingSpinner}
                  className='flex justify-center items-center bg-[#3276BD] hover:bg-[#255fa3] disabled:opacity-60 mt-2 py-2 rounded-xl font-bold text-white transition'>
                  {loadingSpinner ? <i className='fa-solid fa-spinner fa-spin'></i> : `Sign in as ${role}`}
                </button>
                <p className='my-2 font-bold text-[#4A6580] text-center text-sm'>
                  Don't have an account?{' '}
                  <Link to='/register' className='text-[#4DD0AF] hover:text-[#3ab99a]'>Sign up</Link>
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  )
}