import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title = "Rene Kristofer Pohlak - IT Professional | JavaScript, Python, C# Developer",
  description = "Self-motivated IT professional with experience in web development (JavaScript, React, Node.js), programming (C#, Python), API development, server management, and IT infrastructure. Completed The Odin Project. Based in Tallinn, Estonia.",
  type = "website",
  url = "https://renekris.dev",
  image = "https://renekris.dev/og-image.jpg",
  keywords = "Rene Kristofer Pohlak, IT professional, JavaScript developer, Python developer, C# developer, React developer, Node.js, web development, API development, server management, Tallinn, Estonia, The Odin Project, IT infrastructure, virtualization, SMIT"
}) => {
  const siteTitle = "Rene Kristofer Pohlak";
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Rene Kristofer Pohlak" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="author" content="Rene Kristofer Pohlak" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      
      {/* Language and Location */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="EE-37" />
      <meta name="geo.placename" content="Tallinn" />
      <meta name="geo.position" content="59.437;24.7536" />
    </Helmet>
  );
};

export default SEOHead;
