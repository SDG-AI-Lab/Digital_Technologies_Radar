/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useContext, useEffect, useState } from 'react';
import cx from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { RadarContext } from 'navigation/context';
import { useRadarState, BlipType } from '@undp_sdg_ai_lab/undp-radar';

import './ProjectDetails.scss';

export const ProjectDetails: React.FC = () => {
  const [project, setProject] = useState<BlipType>();
  const [selectedSection, setSelectedSection] = useState<string>('details');
  const projectId = useLocation().pathname?.split('/')[2];

  const {
    state: { blips }
  } = useRadarState();

  const { currentProject } = useContext(RadarContext);

  useEffect(() => {
    if (!currentProject) {
      const project = blips.filter(
        (p) => p['Ideas/Concepts/Examples'] === decodeURIComponent(projectId)
      )[0];
      setProject(project);
    } else {
      setProject(currentProject);
    }
  }, [blips]);

  console.log({ project });
  const fallBackImage =
    'https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg';

  const joinArrayStrings = (array = []): string => {
    return array?.join(', ');
  };

  const handleScroll = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView();
    }
  };

  return (
    <div className='projectDetailsPage'>
      <div className='projectHero'>
        <div className='projectTitle'>
          <span>{(project as any)?.['Ideas/Concepts/Examples']}</span>
          <a
            href={(project as any)?.['Source']}
            target='_blank'
            rel='noopener noreferrer'
            className='seeProject'
          >
            SEE PROJECT
          </a>
        </div>
        <div className='projectImg'>
          <img
            src={
              (project as any)?.['Image Url'].length > 0
                ? `${(project as any)?.['Image Url']}`
                : fallBackImage
            }
            onError={(e) => {
              // @ts-expect-error
              e.target.src = fallBackImage;
            }}
            alt='Default Image'
          />
        </div>
      </div>
      <div className='projectBody'>
        <div className='projectToc'>
          <Link
            to='#'
            className={cx({ bolden: selectedSection === 'details' })}
            onClick={() => {
              handleScroll('project-details-section');
              setSelectedSection('details');
            }}
          >
            Details
          </Link>
          <Link
            to='#'
            className={cx({ bolden: selectedSection === 'technology' })}
            onClick={() => {
              handleScroll('project-technology-section');
              setSelectedSection('technology');
            }}
          >
            Technology
          </Link>
          <Link
            to='#'
            className={cx({ bolden: selectedSection === 'use-case' })}
            onClick={() => {
              handleScroll('project-use-case-section');
              setSelectedSection('use-case');
            }}
          >
            Use Case
          </Link>
          <Link
            to='#'
            className={cx({ bolden: selectedSection === 'partners' })}
            onClick={() => {
              handleScroll('project-partners-section');
              setSelectedSection('partners');
            }}
          >
            Partners
          </Link>
          <Link
            to='#'
            className={cx({ bolden: selectedSection === 'others' })}
            onClick={() => {
              handleScroll('project-others-section');
              setSelectedSection('others');
            }}
          >
            Other details
          </Link>
        </div>
        <div className='projectContent'>
          <section id='project-details-section'>
            <span className='projectDetailsTitle'> Details</span>
            <p className='projectDetailsContent'>
              {(project as any)?.['Description']}
            </p>
          </section>
          <hr className='separater' />

          <section id='project-technology-section'>
            <span className='projectDetailsTitle'> Technology</span>
            <p className='projectDetailsContent'>
              {joinArrayStrings((project as any)?.['Technology'])}
            </p>
          </section>
          <hr className='separater' />

          <section id='project-use-case-section'>
            <span className='projectDetailsTitle'> Use Case </span>
            <p className='projectDetailsContent'>
              {(project as any)?.['Use Case']}
            </p>
          </section>
          <hr className='separater' />

          <section id='project-partners-section'>
            <span className='projectDetailsTitle'> Partners </span>
            <p className='projectDetailsContent'>
              {(project as any)?.['Supporting Partners']}
            </p>
          </section>
          <hr className='separater' />

          <section id='project-others-section'>
            <span className='projectDetailsTitle'> Other Details </span>
            <div className='otherDetails'>
              <span className='otherDetailsLabel'> Disaster Type:</span>
              <span className='otherDetailsContent'>
                {(project as any)?.['Disaster Type']}
              </span>
            </div>
            <div className='otherDetails'>
              <span className='otherDetailsLabel'> UN Host Organization:</span>
              <span className='otherDetailsContent'>
                {(project as any)?.['UN Host Organization'] || 'N/A'}
              </span>
            </div>
            <div className='otherDetails'>
              <span className='otherDetailsLabel'> Data:</span>
              <span className='otherDetailsContent'>
                {(project as any)?.['Data'] || 'N/A'}
              </span>
            </div>
            <div className='otherDetails'>
              <span className='otherDetailsLabel'> Theme:</span>
              <span className='otherDetailsContent'>
                {(project as any)?.['Theme'] || 'N/A'}
              </span>
            </div>
            <div className='otherDetails'>
              <span className='otherDetailsLabel'> Publication Date:</span>
              <span className='otherDetailsContent'>
                {(project as any)?.['Date of Implementation'] || 'N/A'}
              </span>
            </div>
          </section>
          <hr className='separater' />
        </div>
      </div>
    </div>
  );
};
