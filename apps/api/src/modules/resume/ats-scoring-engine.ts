export interface AtsScoreBreakdown {
  totalScore: number;
  keywordMatchScore: number;
  skillMatchScore: number;
  formattingScore: number;
  sectionCompleteness: number;
  missingKeywords: string[];
}

export const calculateAtsScore = (
  parsedResumeText: string,
  parsedStructure: any,
  jobDescriptionText?: string,
  jobRequiredSkills: string[] = []
): AtsScoreBreakdown => {
  let totalScore = 0;
  
  // 1. Section Completeness (Max 20 points)
  let sectionCompleteness = 0;
  if (parsedStructure.contact?.email) sectionCompleteness += 5;
  if (parsedStructure.education && parsedStructure.education.length > 0) sectionCompleteness += 5;
  if (parsedStructure.experience && parsedStructure.experience.length > 0) sectionCompleteness += 5;
  if (parsedStructure.skills && parsedStructure.skills.length > 0) sectionCompleteness += 5;
  totalScore += sectionCompleteness;

  // 2. Formatting & Parseability (Max 20 points)
  let formattingScore = 20;
  // A simple heuristic: if it parsed to a massive single block without spaces, penalize.
  if (parsedResumeText.length > 0 && parsedResumeText.split('\\n').length < 10) {
    formattingScore -= 10;
  }
  totalScore += formattingScore;

  // 3. Skill Match (Max 30 points)
  let skillMatchScore = 30;
  if (jobRequiredSkills.length > 0) {
    const resumeSkills = (parsedStructure.skills || []).map((s: string) => s.toLowerCase());
    const matchedSkills = jobRequiredSkills.filter(reqSkill => 
      resumeSkills.includes(reqSkill.toLowerCase()) || parsedResumeText.toLowerCase().includes(reqSkill.toLowerCase())
    );
    skillMatchScore = Math.floor((matchedSkills.length / jobRequiredSkills.length) * 30);
  }
  totalScore += skillMatchScore;

  // 4. Keyword Overlap (Max 30 points)
  let keywordMatchScore = 30;
  const missingKeywords: string[] = [];
  
  if (jobDescriptionText) {
    // Very basic extraction of words > 4 chars as "keywords" for MVP
    const jdWords = Array.from(new Set(jobDescriptionText.toLowerCase().match(/\\b[a-z]{5,}\\b/g) || []));
    const cvWords = new Set(parsedResumeText.toLowerCase().match(/\\b[a-z]{5,}\\b/g) || []);
    
    const matchedKeywords = jdWords.filter(word => cvWords.has(word));
    missingKeywords.push(...jdWords.filter(word => !cvWords.has(word)).slice(0, 5)); // Top 5 missing

    if (jdWords.length > 0) {
      keywordMatchScore = Math.floor((matchedKeywords.length / jdWords.length) * 30);
    }
  }
  totalScore += keywordMatchScore;

  return {
    totalScore,
    keywordMatchScore,
    skillMatchScore,
    formattingScore,
    sectionCompleteness,
    missingKeywords
  };
};
