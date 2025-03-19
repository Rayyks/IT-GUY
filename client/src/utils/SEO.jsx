import { useEffect } from "react";
import { Fragment } from "react";
import { Helmet } from "react-helmet-async";

export const AppLayout = ({ title, content, children }) => {
  useEffect(() => {
    document.title = title || "IT.GUY";
  }, [title]);

  return (
    <Fragment>
      <Helmet>
        <title>{title || "IT.GUY"}</title>
        <meta name="description" content={content} />
      </Helmet>
      {children}
    </Fragment>
  );
};
