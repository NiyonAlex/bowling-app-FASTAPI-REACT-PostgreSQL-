export const getFrameIndex = (frames) => frames.length - 1;

export const isBonusRoll = (rolls) => {
  const bonusRoll = 20;
  return rolls === bonusRoll;
};

export const isEven = (number) => number % 2 === 0;

export const isGameOver = (rolls, lastScore, pins) => {
  const GameNotOver =
    rolls < 19 ||
    (rolls === 19 &&
      (isSpare(lastScore, pins.slice(-1)[0]) || isStrike(pins.slice(-1)[0])));
  return !GameNotOver;
};

export const isSpare = (roll1, roll2) => roll1 + roll2 === 10;

export const isStrike = (pins) => {
  const strike = 10;
  return pins === strike;
};

export const strikeBonus = (roll1, roll2) => 10 + roll1 + roll2;

export const updateCumulativeScore = (
  rolls,
  frames,
  cumulativeScores,
  pins,
  lastScore
) => {
  const currentScore = cumulativeScores.slice(-1)[0] || 0;

  if (
    (!isEven(rolls) &&
      !isStrike(lastScore) &&
      !isSpare(pins.slice(-1)[0], lastScore)) ||
    isBonusRoll(rolls)
  ) {
    const frameScore = isBonusRoll(rolls)
      ? frames[getFrameIndex(frames)].slice(-1)[0] +
        frames[getFrameIndex(frames)].slice(-2)[0] +
        lastScore
      : frames[getFrameIndex(frames)].slice(-1)[0] + lastScore;

    if (
      isStrike(pins.slice(-1)[0]) &&
      !isStrike(pins.slice(-2)[0]) &&
      rolls === 19
    )
      return cumulativeScores;
    if (isStrike(pins.slice(-2)[0]) && rolls > 2 && rolls < 20) {
      const bonus = strikeBonus(pins.slice(-1)[0], lastScore);
      const previousFrame = bonus + currentScore;
      return isStrike(pins.slice(-1)[0]) && rolls === 19
        ? cumulativeScores.concat(previousFrame)
        : cumulativeScores.concat(previousFrame, frameScore + previousFrame);
    }
    const updatedFrameScores = cumulativeScores.concat(
      currentScore + frameScore
    );
    return updatedFrameScores;
  } else if (isStrike(pins.slice(-2)[0]) && rolls > 2 && rolls < 20) {
    const bonus = strikeBonus(pins.slice(-1)[0], lastScore);
    return cumulativeScores.concat(currentScore + bonus);
  } else if (isEven(rolls) && isSpare(pins.slice(-2)[0], pins.slice(-1)[0])) {
    const spareFrame = 10 + lastScore;
    return cumulativeScores.concat(currentScore + spareFrame);
  }
  return cumulativeScores;
};

export const updateCurrentRoll = (rolls, lastScore) => {
  if (isStrike(lastScore) && isEven(rolls) && rolls < 18) {
    return rolls + 2;
  } else {
    return rolls + 1;
  }
};

export const updateFrames = (rolls, lastScore, frames) => {
  if (isEven(rolls) && !isBonusRoll(rolls)) {
    return frames.concat([[lastScore]]);
  } else {
    const newFrameScore = frames[getFrameIndex(frames)].concat([lastScore]);
    return frames.slice(0, getFrameIndex(frames)).concat([newFrameScore]);
  }
};
