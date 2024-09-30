import React from 'react'

const Features = () => {
  return (
<div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
  <div class="aspect-w-16 aspect-h-7">
    <img class="w-full object-cover rounded-xl h-[300px]" src="https://contentstatic.timesjobs.com/img/61950097/Master.jpg" alt="Image Description"/>
  </div>

  <div class="mt-5 lg:mt-16 grid lg:grid-cols-3 gap-8 lg:gap-12">
    <div class="lg:col-span-1">
      <h2 class="font-bold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200">
      Empowering Your Career Journey with the Perfect Job
      </h2>
      <p class="mt-2 md:mt-4 text-gray-500 dark:text-neutral-500">
      Find tailored job opportunities, connect with employers, and advance your career with personalized guidance and support.
      </p>
    </div>

    <div class="lg:col-span-2">
      <div class="grid sm:grid-cols-2 gap-8 md:gap-12">
  
        <div class="flex gap-x-5">
          <svg class="flex-shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" x2="8" y1="16" y2="16"/><line x1="16" x2="16" y1="16" y2="16"/></svg>
          <div class="grow">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
            Skill-Based Job Matching
            </h3>
            <p class="mt-1 text-gray-600 dark:text-neutral-400">
            Connect with clients who need your specific craftsmanship. Our platform matches 
            your skills with relevant job opportunities, ensuring you find projects that align with your expertise and interests.
            </p>
          </div>
        </div>

        <div class="flex gap-x-5">
          <svg class="flex-shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
          <div class="grow">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
            Portfolio Creation and Management
            </h3>
            <p class="mt-1 text-gray-600 dark:text-neutral-400">
            Showcase your work with a professional portfolio. Upload photos, project descriptions,
             and client reviews to attract potential clients and highlight your unique skills and completed projects.
            </p>
          </div>
        </div>
  
        <div class="flex gap-x-5">
          <svg class="flex-shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          <div class="grow">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
            Client Reviews and Ratings
            </h3>
            <p class="mt-1 text-gray-600 dark:text-neutral-400">
            Build trust with potential clients by collecting and displaying reviews from past jobs. 
            Positive feedback and ratings enhance your profile and increase your chances of being hired for new projects
            </p>
          </div>
        </div>
      
        <div class="flex gap-x-5">
          <svg class="flex-shrink-0 mt-1 size-6 text-blue-600 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <div class="grow">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
            Project Bidding and Negotiation
            </h3>
            <p class="mt-1 text-gray-600 dark:text-neutral-400">
            Bid on projects that fit your skills and negotiate terms directly with clients. Our platform
             supports transparent communication, ensuring you can secure jobs that match your expertise and compensation expectations.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default Features