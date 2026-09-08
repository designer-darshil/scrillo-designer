import React from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { EditorialContact } from '../components/editorial/EditorialContact';

export const ContactPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="pt-20 sm:pt-24 bg-[#060606] min-h-screen text-white">
        <EditorialContact />
      </div>
    </PageTransition>
  );
};

export default ContactPage;
