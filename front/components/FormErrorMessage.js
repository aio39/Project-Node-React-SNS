import React from 'react';
import styled from 'styled-components';

const StyledFormErrorMessage = styled.div`
  position: absolute;
  padding-left: 5px;
  color: red;
`;

// export
function FormErrorMessage({ errorMessage }) {
  return <StyledFormErrorMessage>{errorMessage}</StyledFormErrorMessage>;
}

export default FormErrorMessage;
