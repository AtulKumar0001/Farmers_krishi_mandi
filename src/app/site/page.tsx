"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import {
  FaLeaf,
  FaHandshake,
  FaStore,
  FaMicrophone,
  FaCloudSun,
} from "react-icons/fa";

type Feature = {
  icon: keyof typeof Icons;
  title: string;
  description: string;
};

type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

type Translations = {
  heroTitle: string;
  getStarted: string;
  ourFeatures: string;
  learnMore: string;
  howItWorks: string;
  infographicPlaceholder: string;
  smartFarmingFeatures: string;
  aiVoiceAssistance: string;
  aiVoiceDescription: string;
  weatherAlerts: string;
  weatherAlertsDescription: string;
  whatOurUsersSay: string;
  stayUpdated: string;
  emailPlaceholder: string;
  subscribe: string;
  privacyPolicy: string;
  termsOfService: string;
  socialMediaIcons: string;
  features: Feature[];
  testimonials: Testimonial[];
};

// Define an object with all your icons
const Icons = {
  FaLeaf,
  FaHandshake,
  FaStore,
  FaMicrophone,
  FaCloudSun,
};

export default function Home() {
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState(searchParams.get('lang') || "en");
  const [translations, setTranslations] = useState<Translations>({} as Translations);
  const [isTranslating, setIsTranslating] = useState(false);

  const contentToTranslate: Translations = {
    heroTitle: "Empowering Farmers with Fair Contracts and Secure Payments",
    getStarted: "Get Started",
    ourFeatures: "Our Features",
    learnMore: "Learn More",
    howItWorks: "How It Works",
    infographicPlaceholder: "Insert your infographic or flowchart here",
    smartFarmingFeatures: "Smart Farming Features",
    aiVoiceAssistance: "AI Voice Assistance",
    aiVoiceDescription: "Get help with voice commands",
    weatherAlerts: "Weather Alerts",
    weatherAlertsDescription: "Stay informed about weather conditions",
    whatOurUsersSay: "What Our Users Say",
    stayUpdated: "Stay Updated",
    emailPlaceholder: "Enter your email",
    subscribe: "Subscribe",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    socialMediaIcons: "Social Media Icons",
    features: [
      {
        icon: "FaLeaf",
        title: "Land Leasing",
        description: "Find or list agricultural land for lease.",
      },
      {
        icon: "FaHandshake",
        title: "Pre-Harvest Contracts",
        description: "Secure contracts before planting season.",
      },
      {
        icon: "FaStore",
        title: "Post-Harvest Sales",
        description: "Sell your harvested crops with ease.",
      },
    ],
    testimonials: [
      {
        name: "John Doe",
        role: "Farmer",
        quote: "This platform has revolutionized how I do business.",
      },
      {
        name: "Jane Smith",
        role: "Buyer",
        quote: "I've found reliable suppliers thanks to this service.",
      },
    ],
  };

  useEffect(() => {
    const newLang = searchParams.get('lang');
    if (newLang && newLang !== language) {
      setLanguage(newLang);
    }
    setIsTranslating(true);
  }, [searchParams, language]);

  useEffect(() => {
    const translateContent = async () => {
      if (language === 'en') {
        setTranslations(contentToTranslate);
        setIsTranslating(false);
        return;
      }

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ texts: contentToTranslate, targetLanguage: language }),
        });

        if (!response.ok) {
          throw new Error('Translation request failed');
        }

        const translatedContent: Translations = await response.json();
        setTranslations(translatedContent);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslations(contentToTranslate);
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [language, contentToTranslate]);

  const getContent = (key: keyof Translations): string | Feature[] | Testimonial[] => {
    if (isTranslating || !translations[key]) {
      return contentToTranslate[key];
    }
    return translations[key];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <Image 
          src="/hero-image.jpg" 
          alt="Farming landscape" 
          fill
          style={{ objectFit: 'cover' }}
          className="z-0"
        />
        <div className="z-10 text-center px-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {getContent('heroTitle')}
          </h1>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 sm:mt-0">
            <Link href="/login">
              <span>{getContent('getStarted')}</span>
            </Link>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">{getContent('ourFeatures')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {getContent('features').map((feature: Feature, index: number) => {
              const Icon = Icons[feature.icon];
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md text-center"
                >
                  {Icon && <Icon className="text-4xl text-green-500 mx-auto mb-4" />}
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="mb-4">{feature.description}</p>
                  <button className="text-green-500 hover:text-green-600 font-semibold">
                    {getContent('learnMore')}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ... (rest of the sections remain the same) ... */}

    </div>
  );
}
