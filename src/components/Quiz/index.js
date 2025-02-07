import React, { Component } from 'react';
import {
  Container,
  Segment,
  Item,
  Divider,
  Button,
  Icon,
  Message,
  Menu,
  Header
} from 'semantic-ui-react';
import Swal from 'sweetalert2';

import Loader from '../Loader';
import Result from '../Result';
import Countdown from '../Countdown';
import Offline from '../Offline';

import he from 'he';
import { getRandomNumber } from '../../utils/getRandomNumber';



class Quiz extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quizData: null,
      isLoading: true,
      questionIndex: 0,
      correctAnswers: 0,
      userSlectedAns: [],
      quizIsCompleted: false,
      questionsAndAnswers: [],
      isOffline: false
    };

    this.timeTakesToComplete = undefined;

    this.setData = this.setData.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.timesUp = this.timesUp.bind(this);
    this.timeAmount = this.timeAmount.bind(this);
    this.renderResult = this.renderResult.bind(this);
    this.retakeQuiz = this.retakeQuiz.bind(this);
    this.startNewQuiz = this.startNewQuiz.bind(this);
    this.resolveError = this.resolveError.bind(this);
  }

  componentDidMount() {
    const { API } = this.props;
    // console.log(API);

    fetch(API)
      .then(respone => respone.json())
      .then(result => setTimeout(() => this.setData(result), 1000))
      .catch(error => setTimeout(() => this.resolveError(error), 1000));
  }

  resolveError(error) {
    if (!navigator.onLine) {
      // console.log('Connection problem');
      this.setState({ isOffline: true });
    } else {
      // console.log('API problem ==> ', error);
      this.setState({ isOffline: true });
    }
  }

  setData(results) {
    console.log(results);
    if (results.length === 0) {
      const message =
        "The API doesn't have enough questions for your query<br />" +
        '(ex. Asking for 50 questions in a category that only has 20).' +
        '<br /><br />Please change number of questions, difficulty level ' +
        'or type of questions.';

      return Swal.fire({
        title: 'Oops...',
        html: message,
        type: 'error',
        timer: 10000,
        onClose: () => {
          this.props.backToHome();
        }
      });
    }
    const quizData = results;
    
    //const quizData = [PM1,PM2];
    const { questionIndex } = this.state;
    const outPut = getRandomNumber(0, 3);
    const options = [...quizData[questionIndex].incorrect_answers.concat(quizData[questionIndex].correct_answer)];
    //options.splice(outPut, 0, quizData[questionIndex].correct_answer);

    this.setState({ quizData, isLoading: false, options, outPut });
  }

  handleItemClick(e, { name }) {
    let userSelectedAns = this.state.userSlectedAns;
    if (userSelectedAns.includes(name))  {
      userSelectedAns = userSelectedAns.filter(item => item !== name)
    }else{
      userSelectedAns.push(name)
    }
    this.setState({ userSlectedAns: userSelectedAns });
  }

  handleNext() {
    const {
      userSlectedAns,
      quizData,
      questionIndex,
      correctAnswers,
      questionsAndAnswers
    } = this.state;

    let point = 0;
    let correct = 0;
    let selected = userSlectedAns.length;
    let correctlength = quizData[questionIndex].correct_answer.length
    userSlectedAns.forEach(answer =>{
      if(quizData[questionIndex].correct_answer.includes(answer)){
        correct = correct + 1;
      }
    })

    if (correct === selected && correctlength === correct) {
      point = 1;
    }

    let question = he.decode(quizData[questionIndex].question)
    let correct_answer = quizData[questionIndex].correct_answer;
    questionsAndAnswers.push({
      question,
      user_answer: userSlectedAns,
      correct_answer,
      point
    });

    if (questionIndex === quizData.length - 1) {
      this.setState({
        correctAnswers: correctAnswers + point,
        userSlectedAns: [],
        isLoading: true,
        quizIsCompleted: true,
        questionIndex: 0,
        options: null,
        questionsAndAnswers
      });
      return;
    }

    const outPut = getRandomNumber(0, 3);

    const options = [...quizData[questionIndex + 1].incorrect_answers.concat(quizData[questionIndex + 1].correct_answer)];
    //options.splice(outPut, 0, quizData[questionIndex + 1].correct_answer);
    

    this.setState({
      correctAnswers: correctAnswers + point,
      questionIndex: questionIndex + 1,
      userSlectedAns: [],
      options,
      outPut,
      questionsAndAnswers
    });

  }

  timesUp() {
    this.setState({
      userSlectedAns: [],
      isLoading: true,
      quizIsCompleted: true,
      questionIndex: 0,
      options: null
    });
  }

  timeAmount(timerTime, totalTime) {
    this.timeTakesToComplete = {
      timerTime,
      totalTime
    };
  }

  renderResult() {
    setTimeout(() => {
      const { quizData, correctAnswers, questionsAndAnswers } = this.state;
      const { backToHome } = this.props;

      const resultRef = (
        <Result
          totalQuestions={quizData.length}
          correctAnswers={correctAnswers}
          timeTakesToComplete={this.timeTakesToComplete}
          questionsAndAnswers={questionsAndAnswers}
          retakeQuiz={this.retakeQuiz}
          backToHome={backToHome}
        />
      );

      this.setState({ resultRef, questionsAndAnswers: [] });
    }, 2000);
  }

  retakeQuiz() {
    // console.log('Retake quiz func');
    const { quizData, questionIndex } = this.state;
    const outPut = getRandomNumber(0, 3);
    const options = [...quizData[questionIndex].incorrect_answers];
    options.splice(outPut, 0, quizData[questionIndex].correct_answer);

    this.setState({
      correctAnswers: 0,
      quizIsCompleted: false,
      startNewQuiz: true,
      options,
      outPut
    });
  }

  startNewQuiz() {
    setTimeout(() => {
      this.setState({ isLoading: false, startNewQuiz: false, resultRef: null });
    }, 1000);
  }

  render() {
    const {
      quizData,
      questionIndex,
      options,
      userSlectedAns,
      isLoading,
      quizIsCompleted,
      resultRef,
      startNewQuiz,
      isOffline
      // outPut,
      // correctAnswers,
    } = this.state;

    // console.log(userSlectedAns);
    // console.log(questionIndex, outPut);
    // console.log('Score ==>', correctAnswers);

    if (quizIsCompleted && !resultRef) {
      this.renderResult();
      // console.log('Redirecting to result');
    }

    if (startNewQuiz) {
      this.startNewQuiz();
    }

    return (
      <Item.Header>
        {!isOffline && !quizIsCompleted && isLoading && <Loader />}

        {!isOffline && !isLoading && (
          <Container>
            <Segment>
              <Item.Group divided>
                <Item>
                  <Item.Content>
                    <Item.Extra>
                      <Header as="h1" block floated="left">
                        <Icon name="info circle" />
                        <Header.Content>
                          {`Pregunta No. ${questionIndex + 1} de ${
                            quizData.length
                          }`}
                        </Header.Content>
                      </Header>
                      <Countdown
                        countdownTime={this.props.countdownTime}
                        timesUp={this.timesUp}
                        timeAmount={this.timeAmount}
                      />
                    </Item.Extra>
                    <br />
                    <Item.Meta>
                      <Message size="huge" floating>
                        <td dangerouslySetInnerHTML={{__html: `<b>${quizData[questionIndex].question}</b>`}} />
                      </Message>
                      <br />
                      <Item.Description>
                        <h3>Escoge la alternativa que mejor responda:</h3>
                      </Item.Description>
                      <Divider />
                      <Menu vertical fluid size="massive">
                        {options.map((option, i) => {
                          let letter;

                          switch (i) {
                            case 0:
                              letter = 'A.';
                              break;
                            case 1:
                              letter = 'B.';
                              break;
                            case 2:
                              letter = 'C.';
                              break;
                            case 3:
                              letter = 'D.';
                              break;
                            case 4:
                              letter = 'E.';
                              break;
                            case 5:
                              letter = 'F.';
                              break;
                            case 6:
                              letter = 'G.';
                              break;
                            case 7:
                              letter = 'H.';
                              break;
                            default:
                              letter = i;
                              break;
                          }

                          const decodedOption = he.decode(option);

                          return (
                            <Menu.Item
                              key={decodedOption}
                              name={decodedOption}
                              active={userSlectedAns.includes(decodedOption)}
                              onClick={this.handleItemClick}
                            >
                              <b style={{ marginRight: '8px' }}>{letter}</b>
                              {decodedOption}
                            </Menu.Item>
                          );
                        })}
                      </Menu>
                    </Item.Meta>
                    <Divider />
                    <Item.Extra>
                      {userSlectedAns ? (
                        <Button
                          primary
                          content="Siguiente"
                          onClick={this.handleNext}
                          floated="right"
                          size="big"
                          icon="right chevron"
                          labelPosition="right"
                        />
                      ) : (
                        <Button
                          disabled
                          primary
                          content="Siguiente"
                          floated="right"
                          size="big"
                          icon="right chevron"
                          labelPosition="right"
                        />
                      )}
                    </Item.Extra>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Segment>
            <br />
          </Container>
        )}

        {quizIsCompleted && !resultRef && (
          <Loader text="Getting your result." />
        )}

        {quizIsCompleted && resultRef}

        {isOffline && <Offline />}
      </Item.Header>
    );
  }
}

export default Quiz;
