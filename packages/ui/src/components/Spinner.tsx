import styled, { keyframes } from "styled-components";
import { computeSize, Size } from "../size";
import { Theme } from "../theme";

const spinnerRotation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

type Props = {
  theme: Theme;
  size?: Size;
};

const Spinner = styled.span<Props>`
  display: inline-block;
  width: 1em;
  height: 1em;
  font-size: ${(props) => computeSize(props.theme, props.size, props.theme)};
  border: 0.2em solid ${(props) => props.theme.colors.text};
  border-top: 0.2em solid rgba(255, 255, 255, 0);
  border-radius: 50%;
  animation: ${spinnerRotation} 1s infinite linear;
  transform: translateZ(0);
`;

export default Spinner;
