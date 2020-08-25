import styled, { css } from "styled-components";
import { computeSize, Size } from "../size";
import { Theme } from "../theme";

type Props = {
  theme: Theme;
  size?: Size;
};

const headerStyle = css<Props>`
  margin: 0;
  margin-bottom: 1em;
  font-size: ${(props) => computeSize(props.theme, props.size, "big")};
`;

const Header = styled.h1<Props>`
  ${headerStyle}
`;
const Sub = styled.h2<Props>`
  ${headerStyle}
`;
const SubSub = styled.h3<Props>`
  ${headerStyle}
`;

export default Object.assign({}, Header, {
  Sub,
  SubSub,
});
