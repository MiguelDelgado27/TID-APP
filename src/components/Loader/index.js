import React from 'react';
import { Container, Message, Icon } from 'semantic-ui-react';

const Loader = ({ text }) => (
  <Container>
    <Message icon size="big">
      <Icon name="circle notched" loading />
      <Message.Content>
        <Message.Header>Un segundo por favor</Message.Header>
        {text || 'Estamos seleccionando las preguntas más difíciles'}
      </Message.Content>
    </Message>
  </Container>
);

export default Loader;
