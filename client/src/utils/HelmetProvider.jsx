import { Helmet } from "react-helmet-async";

export const HelmetProvider = ({ title, content }) => {
  return (
    <Helmet>
      <title>{`${title} - IT.GUY`}</title>
      <meta name="description" content={content} />
    </Helmet>
  );
};
