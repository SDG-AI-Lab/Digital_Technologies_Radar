import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from 'helpers/databaseClient';
import { updateDataVersion } from 'helpers/dataUtils';
import { isAdmin } from 'components/shared/helpers/auth';
import { useNavigate } from 'react-router-dom';

import './projectOverlay.scss';

interface Props {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}

const fallBackImage =
  'https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg';

export const ProjectOverlay: React.FC<Props> = ({
  project,
  isOpen,
  onClose
}) => {
  const [selectedSection, setSelectedSection] = useState<string>('details');
  const [imageUrl, setImageUrl] = useState<string>(fallBackImage);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (project) {
      // Reset image state when project changes
      setImageLoaded(false);
      setSelectedSection('details');

      // Get the image URL from the project data
      const projectImageUrl =
        project.img_url || project['Image Url'] || fallBackImage;
      setImageUrl(projectImageUrl);
    }
  }, [project]);

  const handleImageLoad = (): void => {
    setImageLoaded(true);
  };

  const handleImageError = (): void => {
    console.log('Image failed to load, using fallback');
    setImageUrl(fallBackImage);
    setImageLoaded(true);
  };

  const handleScroll = (id: string): void => {
    const element = document.getElementById(`overlay-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = async (): Promise<void> => {
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
      await updateDataVersion();
      alert('Deleted successfully');
      localStorage.removeItem('drr-projects-list');
      onClose();
      // Refresh the page to update the project list
      window.location.reload();
    }
  };

  const handleDeleteClick = (): void => {
    handleDelete().catch((error) => {
      console.error('Error deleting project:', error);
      alert('There was an error deleting the project. Please try again.');
    });
  };

  const handleEdit = (): void => {
    navigate(`/projects/${project.uuid}/edit`);
    onClose();
  };

  if (!project) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`overlay-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Overlay Panel */}
      <div className={`project-details-overlay ${isOpen ? 'open' : ''}`}>
        <div className='overlay-header'>
          <button className='close-btn' onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className='overlay-content'>
          {/* Project Hero Section */}
          <div
            className='project-hero-overlay'
            style={{
              minHeight: '250px',
              maxHeight: '300px',
              overflow: 'hidden',
              position: 'relative',
              borderRadius: '8px',
              marginBottom: '20px'
            }}
          >
            <div
              className='project-img-overlay'
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <img
                src={imageUrl}
                onLoad={handleImageLoad}
                onError={handleImageError}
                alt={`${project?.title || 'Project'} Image`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  maxHeight: '300px',
                  display: imageLoaded ? 'block' : 'none',
                  backgroundColor: '#f8f9fa'
                }}
              />
              {/* Loading placeholder */}
              {!imageLoaded && (
                <div
                  style={{
                    width: '100%',
                    height: '250px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px'
                  }}
                >
                  Loading image...
                </div>
              )}
            </div>
          </div>

          {/* Project Title Section */}
          <div className='project-title-section'>
            <h2>{project?.title || project['Ideas/Concepts/Examples']}</h2>
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className='project-actions-overlay'>
              <Button
                leftIcon={<EditIcon />}
                bgColor='#2868AC'
                variant='solid'
                color='white'
                size='sm'
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
                size='sm'
                _hover={{ bg: '#D37460' }}
                _active={{}}
                _focus={{}}
                onClick={handleDeleteClick}
              >
                Delete
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className='project-nav-overlay'>
            <button
              className={selectedSection === 'details' ? 'active' : ''}
              onClick={() => {
                handleScroll('project-details-section');
                setSelectedSection('details');
              }}
            >
              Details
            </button>
            <button
              className={selectedSection === 'technology' ? 'active' : ''}
              onClick={() => {
                handleScroll('project-technology-section');
                setSelectedSection('technology');
              }}
            >
              Technology
            </button>
            <button
              className={selectedSection === 'use-case' ? 'active' : ''}
              onClick={() => {
                handleScroll('project-use-case-section');
                setSelectedSection('use-case');
              }}
            >
              Use Case
            </button>
            <button
              className={selectedSection === 'partners' ? 'active' : ''}
              onClick={() => {
                handleScroll('project-partners-section');
                setSelectedSection('partners');
              }}
            >
              Partners
            </button>
            <button
              className={selectedSection === 'others' ? 'active' : ''}
              onClick={() => {
                handleScroll('project-others-section');
                setSelectedSection('others');
              }}
            >
              Other Details
            </button>
          </div>

          {/* Content Sections */}
          <div className='project-content-overlay'>
            <section id='overlay-project-details-section'>
              <h3 className='section-title'>Details</h3>
              <p className='section-content'>
                {project?.description || project.Description}
              </p>
            </section>

            <section id='overlay-project-technology-section'>
              <h3 className='section-title'>Technology</h3>
              <div className='tech-tags'>
                {project?.technology?.map((tech: string, index: number) => (
                  <span key={index} className='tech-tag'>
                    {tech}
                  </span>
                )) || (
                  <span className='section-content'>
                    Artificial Intelligence
                  </span>
                )}
              </div>
            </section>

            <section id='overlay-project-use-case-section'>
              <h3 className='section-title'>Use Case</h3>
              <p className='section-content'>
                {project?.use_case ||
                  'Disaster assessment/prediction and early warning systems'}
              </p>
            </section>

            <section id='overlay-project-partners-section'>
              <h3 className='section-title'>Partners</h3>
              <p className='section-content'>
                {project?.partner?.join(', ') || 'ITU'}
              </p>
            </section>

            <section id='overlay-project-others-section'>
              <h3 className='section-title'>Other Details</h3>
              <div className='other-details-grid'>
                <div className='detail-item'>
                  <span className='detail-label'>Disaster Type:</span>
                  <span className='detail-value'>
                    {project?.disaster_type || 'Various'}
                  </span>
                </div>
                <div className='detail-item'>
                  <span className='detail-label'>UN Host Organization:</span>
                  <span className='detail-value'>
                    {project?.un_host?.join(', ') || 'N/A'}
                  </span>
                </div>
                <div className='detail-item'>
                  <span className='detail-label'>Data:</span>
                  <span className='detail-value'>
                    {project?.data?.join(', ') || 'N/A'}
                  </span>
                </div>
                <div className='detail-item'>
                  <span className='detail-label'>Theme:</span>
                  <span className='detail-value'>
                    {project?.theme || 'Disaster Risk Management'}
                  </span>
                </div>
                <div className='detail-item'>
                  <span className='detail-label'>Publication Date:</span>
                  <span className='detail-value'>
                    {project?.date_of_implementation || 'N/A'}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Project Source Link - At the bottom */}
          {project?.source && (
            <div className='project-source-section'>
              <a
                href={project.source}
                target='_blank'
                rel='noopener noreferrer'
                className='see-project-source-btn'
              >
                See Project Source
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
