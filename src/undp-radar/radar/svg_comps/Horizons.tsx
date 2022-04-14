/* eslint-disable no-plusplus */
import React from 'react';

import { RadarUtilities } from '../RadarUtilities';
import { Utilities } from '../../helpers/Utilities';
import { QuadsType } from '../../types';
// state
import { useDataState } from '../../stores/data.state';

import { Blips } from './Blips';
import { useRadarState } from '../../stores/radar.state';

const SCALE_FAC = 1.75;

export const Horizons: React.FC = () => {
  const {
    state: { radarColors }
  } = useDataState();

  const {
    state: { radarData, selectedQuadrant: quadrant },
    actions: { setSelectedQuadrant }
  } = useRadarState();

  const { width, height, radarOptions, horizons, quadrants } = radarData;
  const { horizonShiftRadius } = radarOptions;
  const horizonWidth = (0.95 * (width > height ? height : width)) / 2;
  const horizonUnit = (horizonWidth - horizonShiftRadius) / horizons.length;

  const quads: QuadsType[] = [];
  for (let i = 0, ilen = quadrants.length; i < ilen; i++) {
    if (quadrants[i] === quadrant || quadrant === null) {
      for (let j = 0, jlen = horizons.length; j < jlen; j++) {
        quads.push({
          quadrant: i,
          horizon: j,
          label: quadrants[i]
        });
      }
    }
  }

  const quadrantIndex = quadrant && radarData.quadrants.indexOf(quadrant);

  const getX = (): number => {
    switch (quadrantIndex) {
      case 0:
        return -radarData.width / 3.25;
      case 1:
        return -radarData.width / 3.25;
      case 2:
        return radarData.width / 3.25;
      case 3:
        return radarData.width / 3.25;
      default:
        return 0;
    }
  };

  const getY = (): number => {
    switch (quadrantIndex) {
      case 0:
        return radarData.height / 2.5;
      case 1:
        return -radarData.height / 2.5;
      case 2:
        return -radarData.height / 2.5;
      case 3:
        return radarData.height / 2.5;
      default:
        return 0;
    }
  };

  const getTextX = (i: number): number => {
    switch (quadrantIndex) {
      case 0:
      case 1:
        return (
          ((i + 1) * horizonUnit -
            horizonUnit / 2 +
            (i === 0 ? horizonShiftRadius / 2 : horizonShiftRadius)) *
          SCALE_FAC
        );
      case 2:
      case 3:
        return (
          -(
            (i + 1) * horizonUnit -
            horizonUnit / 2 +
            (i === 0 ? horizonShiftRadius / 2 : horizonShiftRadius)
          ) * SCALE_FAC
        );
      default:
        return 0;
    }
  };

  const getTextY = (): number => {
    switch (quadrantIndex) {
      case 0:
        return 20;
      case 1:
        return -10;
      case 2:
        return -10;
      case 3:
        return 20;
      default:
        return 0;
    }
  };

  if (quadrant) {
    return (
      <React.Fragment>
        <g transform={`translate(${getX()}, ${getY()})`}>
          {quads.map((h, i) => (
            <React.Fragment key={`${h.label}-${h.quadrant}-${h.horizon}`}>
              {/* <text className={`quadrant-text quadrant-${h.label}`} dx={getDx()} dy={getDy()} textAnchor={getLabelAnchor()}>
              {h.label.charAt(0).toUpperCase() + h.label.slice(1)}
            </text> */}
              <text
                className={`horizon-text horizon-${horizons[h.horizon]}`}
                textAnchor='middle'
                dx={getTextX(i)}
                dy={getTextY()}
                style={{ fontSize: quadrant ? 14 : 10 }}
              >
                {Utilities.capitalize(horizons[h.horizon])}
              </text>
              {/* TODO: remove path stroke and add lines to be consistent */}
              <path
                d={
                  RadarUtilities.quadrants.drawArcs(
                    h,
                    horizonUnit,
                    horizonShiftRadius,
                    SCALE_FAC
                  ) || undefined
                }
                fill={RadarUtilities.quadrants
                  .fillArcs(h, quadrants, {
                    color:
                      radarColors?.quadrants.colors &&
                      radarColors.quadrants.colors[quadrantIndex as number],
                    ...radarColors.quadrants
                  })
                  ?.toString()}
                stroke='grey'
                strokeWidth={0.5}
                // stroke={i === 3 ? 'grey' : ''}
                className='horizon-arc'
              />
            </React.Fragment>
          ))}
          <g className='blips'>
            <Blips scaleFactor={SCALE_FAC} blipSize={0.8} />
          </g>
        </g>
      </React.Fragment>
    );
  }

  const quadAngle = (2 * Math.PI) / quadrants.length;
  return (
    <React.Fragment>
      <g className='quadrants'>
        {quadrants.map((q, i) => (
          <line
            key={`quadrant-${q}`}
            className={`quadrant quadarant-${q
              .toLowerCase()
              .replace(/ /, '-')}`}
            x1={0}
            y1={0}
            x2={Math.cos(quadAngle * i) * horizonWidth}
            y2={Math.sin(quadAngle * i) * horizonWidth}
            stroke='rgba(0,0,0,1)'
            strokeWidth={5}
            fill='none'
          />
        ))}

        {quads
          .filter((q) => q.horizon === 0)
          .map((q) => (
            <text
              key={`quadrant-text-${q.label}`}
              className={`quadrant-text quadrant-${q.label}`}
              dx={RadarUtilities.quadrants.getX(q, height)}
              dy={RadarUtilities.quadrants.getY(q, width)}
              textAnchor={RadarUtilities.quadrants.getLabelAnchor(q)}
              onMouseUp={(): void => setSelectedQuadrant(q.label)}
            >
              {Utilities.capitalize(q.label)}
            </text>
          ))}

        {quads.map((q) => (
          <path
            key={`quadrant-path-${q.label}-${q.horizon}-${q.quadrant}`}
            className={`quadrant quadarant-${q.label
              .toLowerCase()
              .replace(/ /, '-')}`}
            d={
              RadarUtilities.quadrants.drawArcs(
                q,
                horizonUnit,
                horizonShiftRadius
              ) || undefined
            }
            fill={RadarUtilities.quadrants
              .fillArcs(q, horizons, {
                color:
                  radarColors?.quadrants.colors &&
                  radarColors.quadrants.colors[q.quadrant],
                ...radarColors.quadrants
              })
              ?.toString()}
            strokeWidth={0.2}
            stroke='grey'
            // fill="none"
          />
        ))}
      </g>
      <g className='horizons'>
        {horizons.map((h, i) => (
          <circle
            key={`horizon-${h}`}
            className='horizon'
            r={(i + 1) * horizonUnit + horizonShiftRadius}
            cx={0}
            cy={0}
            fill='none'
            stroke='grey'
          />
        ))}
        {horizons.map((h, i) => (
          <text
            key={`horizon-${h}`}
            className={`horizon-text horizon-${h}`}
            textAnchor='middle'
            dx={
              (i + 1) * horizonUnit -
              horizonUnit / 2 +
              (i === 0 ? horizonShiftRadius / 2 : horizonShiftRadius)
            }
            dy={10}
            style={{ fontSize: quadrant ? 14 : 10 }}
          >
            {Utilities.capitalize(h)}
          </text>
        ))}
      </g>
      <g className='blips'>
        <Blips blipSize={0.6} />
      </g>
    </React.Fragment>
  );
};
