/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';

export const mapBlips = (blips: BlipType[]): Map<string, BlipType[]> => {
  const blipsMap = new Map();

  blips.forEach((blip: any) => {
    const countries = blip['Country of Implementation'];

    countries
      .filter(
        (country: string) =>
          ![
            'Global',
            'EU countries',
            'Jamacia',
            'Democratic Republic of the Congo',
            'Micronesi'
          ].includes(country)
      )
      .forEach((country: string) => {
        if (country === 'Jamacia') {
          blip['Country of Implementation'].push('Jamaica');
        }
        if (country === 'Democratic Republic of the Congo') {
          blip['Country of Implementation'].push(
            'Congo, Democratic Republic of the'
          );
        }
        if (country === 'Micronesi') {
          blip['Country of Implementation'].push(
            'Micronesia, Federated States of'
          );
        }
        if (blipsMap.has(country)) {
          const countryBlips = blipsMap.get(country);
          countryBlips.push(blip);
        } else {
          blipsMap.set(country, [blip]);
        }
      });
  });

  return blipsMap;
};
