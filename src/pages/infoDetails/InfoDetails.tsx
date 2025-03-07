/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useContext, useEffect, useState } from 'react';
import cx from 'classnames';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { Image } from 'components/shared/image/Image';
import { Loader } from 'helpers/Loader';
import { supabase } from 'helpers/databaseClient';

import './InfoDetails.scss';
import { LoremIpsum } from 'react-lorem-ipsum';
import { Project } from 'pages/projects/projectComponent/Project';
import { Button } from '@chakra-ui/react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateDataVersion } from 'helpers/dataUtils';
import { RadarContext } from 'navigation/context';
import { isAdmin } from 'components/shared/helpers/auth';

interface Props {
  tableName: string;
  relation: string;
}

export const InfoDetails: React.FC<Props> = ({ tableName, relation }) => {
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<any>([]);
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const { id } = useParams();

  const path = useLocation().pathname;
  const isTechPage = path.includes('technologies');
  const navigate = useNavigate();

  const { setProjectsToEdit } = useContext(RadarContext);

  const fetchItem = async (): Promise<any> => {
    const { data, error } = await supabase
      .from(tableName)
      .select()
      .eq('slug', id);

    if (!error) {
      setItem(data[0]);
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

  const handleScroll = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView();
    }
  };

  const handleEdit = (): void => {
    setProjectsToEdit(projects);
    navigate(`${path}/edit`);
  };

  const handleDelete = async (): Promise<void> => {
    setLoading(true);
    const redirectRoute = isTechPage ? '/technologies' : '/disasters';
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase
      .from(`${isTechPage ? '/technologies' : 'disaster_types'}`)
      .delete()
      .eq('uuid', item.uuid);

    if (error) {
      alert('There was an error. Please try again');
    } else {
      updateDataVersion();
      alert('Deleted successfully');
      navigate(redirectRoute);
    }
    setLoading(false);
  };

  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const projectsPerPage = 2;

  const handleProjectPageChange = (newPage: number): void => {
    setCurrentProjectPage(newPage);
  };

  const startProjectIndex = (currentProjectPage - 1) * projectsPerPage;
  const endProjectIndex = startProjectIndex + projectsPerPage;
  const currentProjects = projects.slice(startProjectIndex, endProjectIndex);

  return item && !loading ? (
    <div className='itemDetailsPage'>
      <div className='itemHero'>
        <div className='itemTitle'>
          <span>{item.name}</span>
          {item?.source && (
            <a
              href={item.source}
              target='_blank'
              rel='noopener noreferrer'
              className='seeitem'
            >
              GET MORE INFORMATION
            </a>
          )}
        </div>
        <div className='itemImg'>
          <Image imgUrl={item.img_url} />
        </div>
      </div>
      {isAdmin && (
        <div className='infoActions'>
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
        </div>
        <div className='itemContent'>
          <section id='item-details-section'>
            <span className='itemDetailsTitle'> {item.name} </span>

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
              {currentProjects.map((project: any) => (
                <div key={project.id}>
                  <Project project={project} />
                  <hr />
                </div>
              ))}
            </div>
            <div className='pagination'>
              {Array.from(
                { length: Math.ceil(projects.length / projectsPerPage) },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => handleProjectPageChange(i + 1)}
                    className={currentProjectPage === i + 1 ? 'active' : ''}
                  >
                    {i + 1}
                  </button>
                )
              )}
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
