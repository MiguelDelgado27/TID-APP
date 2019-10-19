import React, { Component } from 'react';
import { Container, Segment, Item, Divider, Button } from 'semantic-ui-react';
import codeImg from '../../assets/images/code.png';
import Select from '../Select';
import {
  NUM_OF_QUESTIONS,
  COUNTDOWN_TIME
} from '../../constants';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: null,
      numOfQ: null,
      difficulty: null,
      type: null,
      time: null
    };

    this.setValue = this.setValue.bind(this);
  }

  setValue(name, value) {
    this.setState({ [name]: value });
  }

  render() {
    const { numOfQ,time } = this.state;
    // console.log(category, numOfQ, difficulty, type, time);

    let allFieldsSelected = false;
    let selectedValues = null;

    if ( numOfQ && time) {
      allFieldsSelected = true;

      selectedValues = {
        numOfQ,
        time
      };
    }

    return (
      <Container>
        <Segment>
          <Item.Group divided>
            <Item>
              <Item.Image src={codeImg} />
              <Item.Content>
                <Item.Header>
                  <h1>Examen para certificación PSPO I</h1>
                </Item.Header>
                <br />
                <Divider />
                <Item.Meta>
                  <Select
                    name="numOfQ"
                    text="Selecciona el número de preguntas"
                    options={NUM_OF_QUESTIONS}
                    onChange={this.setValue}
                  />
                  <br />
                  <Select
                    name="time"
                    text="Selecciona el tiempo (En minutos)"
                    options={COUNTDOWN_TIME}
                    onChange={this.setValue}
                  />
                </Item.Meta>
                <Divider />
                <Item.Extra>
                  {allFieldsSelected ? (
                    <Button
                      primary
                      content="Comenzar Quiz"
                      onClick={() => this.props.startQuiz(selectedValues)}
                      size="big"
                      icon="play"
                      labelPosition="right"
                    />
                  ) : (
                    <Button
                      disabled
                      primary
                      content="Comenzar Quiz"
                      size="big"
                      icon="play"
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
    );
  }
}

export default Main;
