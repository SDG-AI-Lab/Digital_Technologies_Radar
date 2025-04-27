/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useContext, useEffect, useState } from 'react';
import cx from 'classnames';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { Loader } from 'helpers/Loader';
import { supabase } from 'helpers/databaseClient';
import { updateDataVersion } from 'helpers/dataUtils';
import { RadarContext } from 'navigation/context';

import './ProjectDetails.scss';
import { Button } from '@chakra-ui/react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { isAdmin } from 'components/shared/helpers/auth';

const fallBackImage =
  'https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg';

export const ProjectDetails: React.FC = () => {
  const [project, setProject] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<string>('details');
  const [image, setImage] = useState<any>(fallBackImage);
  const projectId = useParams()?.project_id;
  const fromRadar = useLocation().search.includes('projectsRadar');
  const navigate = useNavigate();
  const { setCurrentProject } = useContext(RadarContext);

  const fetchProject = async (): Promise<any> => {
    const { data, error } = await supabase
      .from(`${fromRadar ? 'project_data' : 'tr_projects'}`)
      .select(`${fromRadar ? '*' : '*, project_data(*)'}`)
      .eq('uuid', projectId)
      .single();

    if (!error) {
      setProject(data as any);
      setImage((data as any).img_url);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const joinArrayStrings = (array = []): string => {
    return array?.join(', ');
  };

  const handleScroll = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView();
    }
  };

  const handleDelete = async (): Promise<void> => {
    const redirectRoute = fromRadar ? '/projectsRadar' : '/projects';
    const tableNames = ['project_data', 'tr_projects'];
    const deleteErrors = [];
    if (!confirm('Are you sure you want to delete this project?')) return;

    for (const table of tableNames) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('title', project.title);
      if (error) deleteErrors.push(error);
    }

    if (deleteErrors.length) {
      alert('There was an error. Please try again');
    } else {
      updateDataVersion();
      alert('Deleted successfully');
      localStorage.removeItem('drr-projects-list');
      navigate(redirectRoute);
    }
  };

  const handleEdit = (): void => {
    setCurrentProject(project);
    navigate(`/projects/${projectId}/edit?from-radar=${fromRadar}`);
  };

  return project ? (
    <div className='projectDetailsPage'>
      <div className='projectHero'>
        <div className='projectTitle'>
          <span>{project?.['title']}</span>
          <a
            href={project?.['source']}
            target='_blank'
            rel='noopener noreferrer'
            className='seeProject'
          >
            SEE PROJECT SOURCE
          </a>
        </div>
        <div
          className='projectImg'
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'repeat',
            backgroundPosition: '50% 50%'
          }}
        >
          <img
            src={project.img_url}
            onError={(e) => {
              // @ts-expect-error
              e.target.src = fallBackImage;
              setImage(fallBackImage);
            }}
            alt='Default Image'
            style={{ display: 'none' }}
          />
        </div>
      </div>
      {isAdmin && (
        <div className='projectActions'>
          <Button
            leftIcon={<EditIcon />}
            bgColor='#2868AC'
            variant='solid'
            color='white'
            _hover={{ bg: '#6895C4' }}
            _active={{}}
            _focus={{}}
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            leftIcon={<DeleteIcon />}
            bgColor='#C1391D'
            variant='solid'
            color='white'
            _hover={{ bg: '#D37460' }}
            _active={{}}
            _focus={{}}
            onClick={() => {
              handleDelete();
            }}
          >
            Delete
          </Button>
        </div>
      )}
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
            <span className='projectDetailsTitle'>
              {`${project?.['title']}`}
            </span>
            <p className='projectDetailsContent'>{project?.['description']}</p>
          </section>
          <hr className='separater' />

          <section id='project-technology-section'>
            <span className='projectDetailsTitle'> Technology</span>
            <p className='projectDetailsContent'>
              {joinArrayStrings(project?.['technology'])}
            </p>
          </section>
          <hr className='separater' />

          <section id='project-use-case-section'>
            <span className='projectDetailsTitle'> Use Case </span>
            <p className='projectDetailsContent'>{project?.['use_case']}</p>
          </section>
          <hr className='separater' />

          <section id='project-partners-section'>
            <span className='projectDetailsTitle'> Partners </span>
            <p className='projectDetailsContent'>
              {project?.['partner'].join(', ')}
            </p>
          </section>
          <hr className='separater' />

          <section id='project-others-section'>
            <span className='projectDetailsTitle'> Other Details </span>
            <div className='otherDetails'>
              <span className='otherDetailsLabel'> Disaster Type:</span>
              <span className='otherDetailsContent'>
                {project?.disaster_type}
              </span>
            </div>
            <div className='otherDetails'>
              <span className='otherDetailsLabel'> UN Host Organization:</span>
              <span className='otherDetailsContent'>
                {project?.['un_host'].join(', ') || 'N/A'}
              </span>
            </div>
            <div className='otherDetails'>
              <span className='otherDetailsLabel'> Data:</span>
              <span className='otherDetailsContent'>
                {project?.['data'].join(', ') || 'N/A'}
              </span>
            </div>
            <div className='otherDetails'>
              <span className='otherDetailsLabel'> Theme:</span>
              <span className='otherDetailsContent'>
                {project?.['theme'] || 'N/A'}
              </span>
            </div>
            <div className='otherDetails'>
              <span className='otherDetailsLabel'> Publication Date:</span>
              <span className='otherDetailsContent'>
                {project?.['date_of_implementation'] || 'N/A'}
              </span>
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
