// Lorem Ipsum from https://fatihtelis.github.io/react-lorem-ipsum/
import { loremIpsum } from 'react-lorem-ipsum';
import { Utilities } from '@undp_sdg_ai_lab/undp-radar';

export type TechDescriptionType = string[];

export class AppConst {
  private static getContent = () =>
    loremIpsum({
      p: 2,
      avgSentencesPerParagraph: 10,
      avgWordsPerSentence: 8
    });

  static readonly technologyDescriptions: Map<string, TechDescriptionType> =
    new Map([
      [Utilities.createSlug('Machine Learning'), this.getContent()],
      [Utilities.createSlug('Artificial Intelligence'), this.getContent()],
      [
        Utilities.createSlug('Geographical Information Systems'),
        this.getContent()
      ]
    ]);
}
