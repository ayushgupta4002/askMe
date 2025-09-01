import React from 'react';
import { FileCode, Smartphone, Book, Layout, Palette, Presentation } from 'lucide-react';

const suggestions = [
  {
    text: 'Explain your responsibilities in your last role?',
    icon: <FileCode className="text-purple-400" size={16} />,
    bgColor: 'bg-purple-400/10',
    textColor: 'text-purple-400',
  },
  {
    text: 'Why do you want to join our company?',
    icon: <Smartphone className="text-gray-400" size={16} />,
    bgColor: 'bg-[#1A1A1A]',
    textColor: 'text-gray-300',
  },
  {
    text: 'Where do you see yourself in 5 years',
    icon: <Book className="text-gray-400" size={16} />,
    bgColor: 'bg-[#1A1A1A]',
    textColor: 'text-gray-300',
  },
  {
    text: 'Create a docs site with Vitepress',
    icon: <Layout className="text-gray-400" size={16} />,
    bgColor: 'bg-[#1A1A1A]',
    textColor: 'text-gray-300',
  },

];

interface SuggestionsProps {
  onSuggestionClick: (text: string) => void;
}

function Suggestions({ onSuggestionClick }: SuggestionsProps) {
  return (
    <div className="flex flex-wrap justify-center mt-4 gap-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion.text)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${suggestion.bgColor} ${suggestion.textColor} hover:bg-opacity-80 transition-colors`}
        >
          {suggestion.icon}
          <span>{suggestion.text}</span>
        </button>
      ))}
    </div>
  );
}

export default Suggestions;