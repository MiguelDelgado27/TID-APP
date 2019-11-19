import React from 'react';
import { Segment, Header, Button } from 'semantic-ui-react';

import { calculateGrade } from '../../utils/calculateGrade';
import { timeConverter } from '../../utils/timeConverter';

const Stats = props => {
  const {
    totalQuestions,
    correctAnswers,
    timeTakesToComplete,
    
    backToHome
  } = props;

  const score = Number(((correctAnswers * 100) / totalQuestions).toFixed(2));
  const { grade, remarks } = calculateGrade(score);
  const { hours, minutes, seconds } = timeConverter(
    timeTakesToComplete.totalTime - timeTakesToComplete.timerTime
  );

  return (
    <Segment>
      <Header as="h1" textAlign="center" block>
        {remarks}
      </Header>
      <Header as="h2" textAlign="center" block>
        Grado: {grade}
      </Header>
      <Header as="h3" textAlign="center" block>
        Nro. Preguntas: {totalQuestions}
      </Header>
      <Header as="h3" textAlign="center" block>
        Rspuestas Correctas: {correctAnswers}
      </Header>
      <Header as="h3" textAlign="center" block>
        Tu puntaje: {score}%
      </Header>
      <Header as="h3" textAlign="center" block>
        Puntaje de Certificación: 85%
      </Header>
      <Header as="h3" textAlign="center" block>
        Tiempo transcurrido: {`${hours} : ${minutes} : ${seconds}`}
      </Header>
      <div style={{ marginTop: 35 }}>
        <Button
          color="teal"
          content="Back to Home"
          onClick={backToHome}
          size="big"
          icon="home"
          labelPosition="right"
          style={{ marginBottom: 8 }}
        />
      </div>
    </Segment>
  );
};

export default Stats;
