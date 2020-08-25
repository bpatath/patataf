import React from "react";
import styled from "styled-components";
import { Theme } from "../theme";

type Props = {
  centered?: boolean;
  children: React.ReactNode;
};

type StyledProps = Props & {
  theme: Theme;
};

const CenteredPageExternalContainer = styled.div<StyledProps>`
  display: flex;
  height: 100%;
  width: 100%;
  margin: 0;
  background-color: ${(props) => props.theme.colors.primary};
`;

const CenteredPageInternalContainer = styled.div<StyledProps>`
  margin: auto;
  background-color: white;
  ${(props) => props.theme.block};
  padding: 1.4em;
  ${(props) => (props.centered ? "text-align: center" : null)};
`;

export default function CenteredPage(props: Props): React.ReactNode {
  return (
    <CenteredPageExternalContainer {...props}>
      <CenteredPageInternalContainer {...props}>
        {props.children}
      </CenteredPageInternalContainer>
    </CenteredPageExternalContainer>
  );
}
