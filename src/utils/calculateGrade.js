const calculateGrade = score => {
  const percentage = parseInt(score);
  let grade = null;
  let remarks = null;

  if (percentage >= 85) {
    grade = 'A';
  } else {
    grade = 'F';
  }

  if (score >= 85) {
    remarks = 'Felicidades, PASASTE!';
  } else {
    remarks = 'Lo siento, INTENTALO NUEVAMENTE!';
  }

  return {
    grade,
    remarks
  };
};

export { calculateGrade };
