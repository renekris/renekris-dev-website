import React from 'react';
import { Helmet } from 'react-helmet-async';

const StructuredData = () => {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Rene Kristofer Pohlak",
    "jobTitle": "IT Professional",
    "url": "https://renekris.dev",
    "email": "renekrispohlak@gmail.com",
    "telephone": "+372 5865 1019",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tallinn",
      "addressCountry": "EE"
    },
    "sameAs": [
      "https://www.linkedin.com/in/rene-kristofer-pohlak-668832114/",
      "https://github.com/renekris"
    ],
    "knowsAbout": [
      "JavaScript",
      "Python",
      "C#",
      "React",
      "Node.js",
      "SQL",
      "HTML",
      "CSS",
      "Web Development",
      "API Development",
      "Server Management",
      "IT Infrastructure",
      "Virtualization",
      "Networking",
      "Jira"
    ],
    "alumniOf": [
      {
        "@type": "EducationalOrganization",
        "name": "Tallinna Tööstushariduskeskus"
      },
      {
        "@type": "EducationalOrganization",
        "name": "The Odin Project"
      }
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Siseministeeriumi infotehnoloogia- ja arenduskeskus (SMIT)"
    },
    "knowsLanguage": [
      {
        "@type": "Language",
        "name": "Estonian",
        "alternateName": "et"
      },
      {
        "@type": "Language",
        "name": "English",
        "alternateName": "en"
      },
      {
        "@type": "Language",
        "name": "Japanese",
        "alternateName": "ja"
      }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Rene Kristofer Pohlak",
    "url": "https://renekris.dev",
    "description": "Full-stack developer and infrastructure engineer portfolio",
    "author": {
      "@type": "Person",
      "name": "Rene Kristofer Pohlak"
    },
    "inLanguage": "en-US"
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": "Rene Kristofer Pohlak",
      "jobTitle": "Full-Stack Developer & DevOps Engineer",
      "url": "https://renekris.dev"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(profilePageSchema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
