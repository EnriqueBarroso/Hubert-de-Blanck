import { Helmet } from 'react-helmet-async';
import { COMPANIA } from '../lib/constants';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
}

export default function SEO({
  title,
  description = COMPANIA.descripcion_corta,
  image,
  type = 'website',
}: SEOProps) {
  const fullTitle = title ? `${title} · ${COMPANIA.nombre}` : `${COMPANIA.nombre} · Compañía Teatral y Sala`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
    </Helmet>
  );
}
