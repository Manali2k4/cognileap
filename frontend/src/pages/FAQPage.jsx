import React from 'react';
import Navigation from '@/components/Navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQPage = () => {
  const faqs = [
    {
      question: 'What age group is this platform designed for?',
      answer: 'CogniLeap is designed for children ages 4-12 with various learning abilities. Our games adapt to each child\'s developmental level, making them suitable for a wide range of cognitive abilities.'
    },
    {
      question: 'How does the reinforcement learning work?',
      answer: 'Our AI system tracks your child\'s performance across multiple dimensions including accuracy, response time, and consistency. It uses this data to dynamically adjust difficulty levels, ensuring optimal challenge without frustration. The system celebrates progress and identifies areas for improvement.'
    },
    {
      question: 'Is the platform suitable for children with specific disabilities?',
      answer: 'Yes! CogniLeap is designed with accessibility in mind and is suitable for children with ADHD, autism spectrum disorders, dyslexia, and other learning differences. Our interface uses large buttons, clear visuals, and simple instructions to support diverse learning needs.'
    },
    {
      question: 'How much time should my child spend on the platform daily?',
      answer: 'We recommend 15-30 minutes per day, split into multiple short sessions if needed. Quality and consistency matter more than duration. Our system tracks engagement and will suggest breaks to prevent fatigue.'
    },
    {
      question: 'Can parents track their child\'s progress?',
      answer: 'Absolutely! The Parent Dashboard provides comprehensive insights including overall progress percentage, time spent, accuracy trends, and streak tracking. You\'ll also receive suggestions for supporting your child\'s learning journey.'
    },
    {
      question: 'Are the games evidence-based?',
      answer: 'Yes, our games are developed in collaboration with clinical psychologists and special education experts. They\'re based on proven cognitive training principles including working memory, attention control, and executive function development.'
    },
    {
      question: 'Is internet connection required?',
      answer: 'Yes, an internet connection is required to track progress and sync data across devices. This also allows our AI system to continuously improve the experience based on your child\'s performance.'
    },
    {
      question: 'How do you ensure child safety and privacy?',
      answer: 'We take privacy seriously. All data is encrypted, we never share personal information with third parties, and our platform is COPPA compliant. Parents have full control over their child\'s profile and data.'
    },
    {
      question: 'What if my child gets frustrated with a game?',
      answer: 'Our adaptive difficulty system is designed to prevent frustration. If a child struggles repeatedly, the system automatically adjusts to an easier level. We also incorporate positive reinforcement, celebrations, and encouraging feedback throughout the experience.'
    },
    {
      question: 'Can multiple children from the same family use the platform?',
      answer: 'Yes! Parents can create multiple child profiles under one account, each with individual progress tracking and personalized difficulty settings.'
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F7F7F7 0%, #E8F5F7 100%)' }}>
      <Navigation />
      
      <div className="pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 fade-in" data-testid="faq-header">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: '#6EC1E4' }}>
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600">
              Everything you need to know about CogniLeap
            </p>
          </div>

          <div className="card fade-in" style={{ animationDelay: '0.2s' }} data-testid="faq-accordion">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} data-testid={`faq-item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold" style={{ color: '#333' }}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-12 text-center card fade-in" style={{ animationDelay: '0.4s', background: 'linear-gradient(135deg, #6EC1E4 0%, #A8E6CF 100%)' }}>
            <h3 className="text-2xl font-bold mb-3 text-white">Still Have Questions?</h3>
            <p className="text-white mb-6 opacity-90">
              We're here to help! Reach out to our support team anytime.
            </p>
            <a 
              href="mailto:support@cognileap.com" 
              className="inline-block bg-white px-8 py-3 rounded-full font-semibold hover-scale"
              style={{ color: '#6EC1E4' }}
              data-testid="contact-support-btn"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;