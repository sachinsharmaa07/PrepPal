export class MatcherService {
  /**
   * Deterministically match a candidate's structured resume against a structured Job Description.
   */
  public match(candidate: any, job: any) {
    if (!candidate || !job) {
      throw new Error('Candidate and Job data are required for matching.');
    }

    const candidateSkills = (candidate.skills || []).map((s: string) => s.toLowerCase());
    
    // Include techStack from projects
    if (candidate.projects) {
      candidate.projects.forEach((p: any) => {
        if (p.technologies) {
          p.technologies.forEach((t: string) => candidateSkills.push(t.toLowerCase()));
        }
      });
    }

    const uniqueCandidateSkills = new Set(candidateSkills);

    const required = (job.requiredSkills || []).map((s: string) => s.toLowerCase());
    const preferred = (job.preferredSkills || []).map((s: string) => s.toLowerCase());
    const concepts = (job.concepts || []).map((s: string) => s.toLowerCase());

    const matchedRequired = required.filter((req: string) => uniqueCandidateSkills.has(req));
    const missingRequired = required.filter((req: string) => !uniqueCandidateSkills.has(req));

    const matchedPreferred = preferred.filter((pref: string) => uniqueCandidateSkills.has(pref));
    const missingPreferred = preferred.filter((pref: string) => !uniqueCandidateSkills.has(pref));

    const matchedConcepts = concepts.filter((conc: string) => uniqueCandidateSkills.has(conc));
    const missingConcepts = concepts.filter((conc: string) => !uniqueCandidateSkills.has(conc));

    // Weighted Scoring Algorithm (out of 100)
    // Required Skills: 50%
    // Preferred Skills: 25%
    // Concepts: 25%
    
    const requiredScore = required.length > 0 ? (matchedRequired.length / required.length) * 50 : 50;
    const preferredScore = preferred.length > 0 ? (matchedPreferred.length / preferred.length) * 25 : 25;
    const conceptScore = concepts.length > 0 ? (matchedConcepts.length / concepts.length) * 25 : 25;

    const totalScore = Math.round(requiredScore + preferredScore + conceptScore);

    return {
      matchScore: totalScore,
      matchedSkills: {
        required: matchedRequired,
        preferred: matchedPreferred,
        concepts: matchedConcepts
      },
      missingSkills: {
        critical: missingRequired,
        recommended: [...missingPreferred, ...missingConcepts]
      }
    };
  }
}
