const calculateATSScore = (atsAnalysis) => {
  const {
    keywordScore = 0,
    skillsScore = 0,
    formattingScore = 0,
    readabilityScore = 0,
    projectsScore = 0,
    experienceScore = 0,
  } = atsAnalysis;

  const finalScore =
    keywordScore * 0.3 +
    skillsScore * 0.2 +
    experienceScore * 0.2 +
    formattingScore * 0.1 +
    projectsScore * 0.1 +
    readabilityScore * 0.1;

  return Math.round(finalScore*10);
};

module.exports = calculateATSScore;