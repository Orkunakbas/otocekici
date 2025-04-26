import React from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, Tab } from "@heroui/react";
import Navbar from '@/components/menu/Navbar';
import Footer from '@/components/frontend/Footer';

export default function Legal() {
  const t = useTranslations('frontend.legal');

  return (
    <>
      <Navbar />
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
            <p className="text-gray-600">{t('description')}</p>
          </div>

          <Tabs 
            aria-label="Legal sections"
            className="mb-8"
          >
            <Tab 
              title={t('tabs.privacy')}
            >
              <div 
                className="prose prose-lg max-w-4xl"
                dangerouslySetInnerHTML={{ __html: t.raw('content.privacy') }} 
              />
            </Tab>
            <Tab 
              title={t('tabs.terms')}
            >
              <div 
                className="prose prose-lg max-w-4xl"
                dangerouslySetInnerHTML={{ __html: t.raw('content.terms') }} 
              />
            </Tab>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      locale
    }
  };
}