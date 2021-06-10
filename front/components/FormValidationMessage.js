import React from 'react';
import styled from 'styled-components';

const StyledFormValidationMessage = styled.div`
  position: absolute;
  padding-left: 5px;
  color: #a8a8a8;
`;

// export
function FormValidationMessage({ validationMessage }) {
  return (
    <StyledFormValidationMessage>
      {validationMessage}
    </StyledFormValidationMessage>
  );
}

export default FormValidationMessage;
