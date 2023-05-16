/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { Link, useParams } from 'react-router-dom';
import { Loader } from 'helpers/Loader';
import { supabase } from 'helpers/databaseClient';

import './InfoDetails.scss';
import { LoremIpsum } from 'react-lorem-ipsum';
import { Project } from 'pages/projects/projectComponent/Project';

interface Props {
  tableName: string;
  relation: string;
}

export const InfoDetails: React.FC<Props> = ({ tableName, relation }) => {
  const [item, setItem] = useState<any>(null);
  const [projects, setProjects] = useState<any>([]);
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const { id } = useParams();

  const fetchItem = async (): Promise<any> => {
    const { data, error } = await supabase
      .from(tableName)
      .select()
      .eq('slug', id);

    if (!error) {
      setItem(data[0] as any);
    }

    getProjects();
  };

  const getProjects = async (): Promise<any> => {
    const { data, error } = await supabase
      .from(relation)
      .select()
      .eq('slug', id);

    if (!error) {
      setProjects(data);
    }
  };

  useEffect(() => {
    fetchItem();
  }, []);

  const fallBackImage =
    'https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg';

  const handleScroll = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView();
    }
  };

  return item ? (
    <div className='itemDetailsPage'>
      <div className='itemHero'>
        <div className='itemTitle'>
          <span>{item.name}</span>
          <a
            href={item.img_url}
            target='_blank'
            rel='noopener noreferrer'
            className='seeitem'
          >
            GET MORE INFORMATION
          </a>
        </div>
        <div className='itemImg'>
          <img
            src={item.img_url}
            onError={(e) => {
              // @ts-expect-error
              e.target.src = fallBackImage;
            }}
            alt='Default Image'
          />
        </div>
      </div>
      <div className='itemBody'>
        <div className='itemToc'>
          <Link
            to='#'
            className={cx({ bolden: selectedSection === 'overview' })}
            onClick={() => {
              handleScroll('item-details-section');
              setSelectedSection('overview');
            }}
          >
            Overview
          </Link>
          <Link
            to='#'
            className={cx({ bolden: selectedSection === 'projects' })}
            onClick={() => {
              handleScroll('item-projects-section');
              setSelectedSection('projects');
            }}
          >
            Projects
          </Link>
          <Link to='#'>Impact</Link>
          <Link to='#'>Data</Link>
        </div>
        <div className='itemContent'>
          <section id='item-details-section'>
            <span className='itemDetailsTitle'> Overview</span>

            {item.description ? (
              item.description.split('##').map((i: string, idx: number) => (
                <p className='itemDetailsContent' key={idx}>
                  {i}
                </p>
              ))
            ) : (
              <p className='itemDetailsContent'>
                <LoremIpsum p={2} />
              </p>
            )}
          </section>
          <hr className='separater' />
          <section id='item-projects-section'>
            <span className='itemDetailsTitle'> Projects </span>
            <div className='projectContainer projectsList'>
              {projects.map((project: any) => (
                <div key={project.id}>
                  <Project project={project} />
                  <hr />
                </div>
              ))}
            </div>
          </section>
          <hr className='separater' />
        </div>
      </div>
    </div>
  ) : (
    <Loader />
  );
};
