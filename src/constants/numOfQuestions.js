const NUM_OF_QUESTIONS = [];

for (let i = 1; i <= 80; i++) {
  const object = { key: i, text: `${i}`, value: i };
  NUM_OF_QUESTIONS.push(object);
}

export default NUM_OF_QUESTIONS;
