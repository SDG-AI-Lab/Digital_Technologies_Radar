import React, { useState, useEffect } from 'react';
import { supabase } from 'helpers/databaseClient';
import { Project } from '../projectComponent/Project';
import { Spinner } from '@chakra-ui/react';

import './ReviewProjects.scss';
import SearchView from 'pages/search/SearchView';
import { isAdmin } from 'components/shared/helpers/auth';
import { useNavigate } from 'react-router-dom';

export const ReviewProjects: React.FC = () => {
  const [projectsToReview, setProjectsToReview] = useState<any>([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/projects ');
    }
    void fetchProjectsToReview();
  }, []);

  const fetchProjectsToReview = async (): Promise<void> => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tr_projects')
      .select()
      .eq('approved', false);

    if (!error) {
      setProjectsToReview(data);
    }
    setLoading(false);
  };

  const handleClick = (project: any): void => {
    setProject(project);
  };

  return (
    <div className='reviewProjects'>
      <h3>Review Projects</h3>
      {projectsToReview.length > 0 ? (
        projectsToReview.map((project: any) => {
          return (
            <div key={project.id}>
              <Project
                project={project}
                handler={handleClick}
                ctaText='Review'
              />
              <hr />
            </div>
          );
        })
      ) : loading ? (
        <Spinner />
      ) : (
        <p>No Projects to review</p>
      )}
      {project && (
        <SearchView
          techContent={project}
          setOpen={true}
          setClose={() => setProject(null)}
        />
      )}
    </div>
  );
};
