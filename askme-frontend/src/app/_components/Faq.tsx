import React, { useState } from 'react';
import { PlusCircle, MinusCircle, HelpCircle, Zap, Shield, Clock, Settings } from 'lucide-react';

interface FAQItem {
  icon: React.ReactNode;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
    {
        icon: <Zap className="w-6 h-6 text-white" />,
        question: "How quickly can I get started?",
        answer: "You can get started immediately after signing up. Use your API key to authenticate on VSCode and you are good to go."
    },
 
    {
        icon: <Settings className="w-6 h-6 text-white" />,
        question: "Can I customize the snippets?",
        answer: "Yes, your snippets are fully customizable. You can customize them anytime and even update them on GitHub Gists instantly with one click."
    },
    {
        icon: <HelpCircle className="w-6 h-6 text-white" />,
        question: "How do I connect to GitHub?",
        answer: "You can connect to GitHub with one click by navigating to the Dashboard page and clicking on the 'Connect to GitHub' button."
    },
    {
        icon: <PlusCircle className="w-6 h-6 text-white" />,
        question: "How do I push or update my GitHub Gists?",
        answer: "If you have already connected your GitHub account, you can push or update your GitHub Gists instantly with one click. Simply go to the snippets page and click on the clearly visible button."
    },

    {
        icon: <Clock className="w-6 h-6 text-white" />,
        question: "Is Snipshelf available for IDEs other than VSCode?",
        answer: "Currently, Snipshelf is only available as an extension for the VSCode IDE."
    },
    {
        icon: <Shield className="w-6 h-6 text-white" />,
        question: "Is my data secure?",
        answer: "Hell yeah dude , I am a good guy -Ayush"
    }
];

function FAQItem({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 pt-5">
      <button
        className="w-full py-6 flex items-center justify-between focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          {item.icon}
          <span className="text-lg font-medium text-left text-white group-hover:text-white/90 transition-colors">
            {item.question}
          </span>
        </div>
        {isOpen ? (
          <MinusCircle className="w-6 h-6 text-white" />
        ) : (
          <PlusCircle className="w-6 h-6 text-white" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-48 pb-6" : "max-h-0"
        }`}
      >
        <p className="text-white/70 leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

function FaqSection() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <HelpCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-white/70 max-w-lg mx-auto">
            Find answers to common questions about our platform. Can't find what you're looking for? 
            Feel free to contact our support team.
          </p>
        </div>

        <div className="space-y-1 bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl ring-1 ring-white/10">
          {faqs.map((faq, index) => (
            <FAQItem key={index} item={faq} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/70">
            Still have questions?{" "}
            <a href="mailto:ayush4002gupta@gmail.com" className="text-white hover:text-white/90 font-medium transition-colors">
              Contact Us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FaqSection;