import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
        question: "How do I book an artisan through Crafty Hands?",
        answer: "Simply select your desired artisan, choose a date and time, and complete the booking form with necessary details. Confirm your appointment and receive a confirmation email."
    },
    {
        question: "What payment methods are accepted on Crafty Hands?",
        answer: "We accept major credit cards, debit cards, and secure online payment methods. Payments are processed through a secure gateway to ensure your information is protected."
    },
    {
        question: "Can I cancel or reschedule my artisan appointment?",
        answer: "Yes, HelpFund uses industry-standard encryption and security measures to ensure that your donation information is safe and secure."
    },
    {
        question: "What should I do if my booked artisan does not show?",
        answer: "Contact our customer support immediately. We will assist you in resolving the issue, including finding an alternative artisan or providing a refund if necessary."
    },
    {
        question: "How do I leave feedback for an artisan I hired?",
        answer: "After your appointment, you'll receive a follow-up email with a feedback link. Complete the survey to rate your experience and leave comments about the artisan’s service."
    },
    {
        question: "Are there any additional fees for using Crafty Hands?",
        answer: "Crafty Hands charges a standard service fee included in the total cost. There are no hidden fees; all costs are clearly outlined during the booking process."
    }
];


  return (
<div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
  <div className="grid md:grid-cols-5 gap-10">
    <div className="md:col-span-2">
      <div className="max-w-xs">
        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">Frequently<br/>asked questions</h2>
        <p className="mt-1 hidden md:block text-gray-600 dark:text-neutral-400">Answers to the most frequently asked questions.</p>
      </div>
    </div>

    <div className="md:col-span-3">
          <div className="hs-accordion-group divide-y divide-gray-200 dark:divide-neutral-700">
            {faqs.map((faq, index) => (
              <div key={index} className={`hs-accordion pt-6 pb-3 ${activeIndex === index ? 'active' : ''}`} id={`hs-basic-with-title-and-arrow-stretched-heading-${index}`}>
                <button
                  className="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-400"
                  aria-controls={`hs-basic-with-title-and-arrow-stretched-collapse-${index}`}
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <svg className="hs-accordion-active:hidden block flex-shrink-0 size-5 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  <svg
                    className={`hs-accordion-active:${activeIndex !== index ? 'block' : 'hidden'} hidden flex-shrink-0 size-5 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div
                  id={`hs-basic-with-title-and-arrow-stretched-collapse-${index}`}
                  className={`hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${activeIndex === index ? 'block' : 'hidden'}`}
                  aria-labelledby={`hs-basic-with-title-and-arrow-stretched-heading-${index}`}
                >
                  <p className="text-gray-600 dark:text-neutral-400">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
  </div>
</div>
  )
}

export default FAQ;