import React, { ReactElement } from "react";
import useLanding from "~/hooks/landing";
import { Layout, Spinner } from "@patataf/ui";

export default function LandingPage(): ReactElement {
  const [error] = useLanding();
  if (error) {
    return <Layout.CenteredPage>Une erreur a eu lieu.</Layout.CenteredPage>;
  } else {
    return (
      <Layout.CenteredPage>
        <Spinner size="big" />
        <br />
        Loading...
      </Layout.CenteredPage>
    );
  }
}
