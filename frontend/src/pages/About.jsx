import React from 'react'
import Title from '../components/Title'
import aboutimage from '../assets/aboutimage.jpg'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16 items-center'>
        <img
          className='w-full md:max-w-[450px] rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out hover:grayscale-0 grayscale'
          src={aboutimage}
          alt="About Us"
        />

        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam
            tenetur veritatis voluptatum eum quis recusandae animi repellendus
            ullam facilis rem perferendis adipisci libero, pariatur consequuntur
            ut laborum nobis quasi! Saepe? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Consequatur beatae, deserunt modi atque veniam fugit
            adipisci officia nam velit, necessitatibus aliquid? Veniam nobis mollitia
            voluptatem! Ad sint mollitia officiis ex.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            vero magnam eveniet, exercitationem voluptatum incidunt impedit,
            minima consequuntur quae repudiandae mollitia odio ullam unde,
            repellendus dolore accusantium! Modi, natus odit.
          </p>
          <b className='text-gray-800'>Our Mission</b>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odit sed
            nihil optio cum esse aspernatur nostrum earum accusantium, saepe
            expedita eum ducimus delectus. Illum earum dolorum, ipsam quas a id?
          </p>
        </div>
      </div>

      <div className='text-4xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 rounded-xl shadow-sm hover:shadow-md transition-shadow'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Recusandae,
            veniam iste neque quae dolores hic distinctio dicta incidunt. Vero
            delectus, laborum iste beatae optio iure excepturi similique nisi ipsum
            autem.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 rounded-xl shadow-sm hover:shadow-md transition-shadow'>
          <b>Convenience:</b>
          <p className='text-gray-600'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Recusandae,
            veniam iste neque quae dolores hic distinctio dicta incidunt. Vero
            delectus, laborum iste beatae optio iure excepturi similique nisi ipsum
            autem.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 rounded-xl shadow-sm hover:shadow-md transition-shadow'>
          <b>Exceptional customer service:</b>
          <p className='text-gray-600'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Recusandae,
            veniam iste neque quae dolores hic distinctio dicta incidunt. Vero
            delectus, laborum iste beatae optio iure excepturi similique nisi ipsum
            autem.
          </p>
        </div>
      </div>

      <NewsLetterBox />
    </div>
  )
}

export default About
