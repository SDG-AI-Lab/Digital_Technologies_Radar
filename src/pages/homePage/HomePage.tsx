/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react';

import { aboutContentList } from 'pages/about/AboutContent';
import './HomePage.scss';
import { Link } from 'react-router-dom';
import { useDataState, useRadarState } from '@undp_sdg_ai_lab/undp-radar';
import { supabase } from 'helpers/databaseClient';
import csvData from 'assets/csv/csv4.csv';
import Papa from 'papaparse';
import { FilterUtils } from 'components/drawers/filter/FilterUtilities';
import { AppConst } from 'components/constants/app';

export const HomePage: React.FC = () => {
  const {
    state: { blips, radarData }
  } = useRadarState();

  const {
    state: {
      keys: { disasterTypeKey: disasterKey }
    }
  } = useDataState();

  const fallBackImage =
    'https://frigiv.palsgaard.com/media/1303/palsgaard-supports-the-un-sustainable-development-goals.jpg';

  const update = async (blops) => {
    // blops.forEach(async (b) => {
    //   const { error } = await supabase
    //     .from('projects')
    //     .update({
    //       disaster_type_id: Number(b.id)
    //     })
    //     .eq('name', b['Ideas/Concepts/Examples']);
    //   console.log({ error });
    // });
  };

  const fetch = async () => {
    // const { data, error } = await supabase.from('projects').select(`
    //   name,
    //   disaster_types (name)
    //   `);

    // console.log({ data }, { error });

    // const { data, error } = await supabase
    //   .from('disaster_projects')
    //   .select()
    //   .eq('disaster', 'Floods')
    //   .limit(3);
    // console.log({ data }, { error });

    const { data, count } = await supabase
      .from('disaster_projects')
      .select('*', { count: 'exact', head: true })
      .eq('disaster', 'Floods');
    console.log({ data }, { count });

    // const { data, count } = await supabase
    //   .from('technology_projects')
    //   .select('*', { count: 'exact', head: true })
    //   .eq('name', 'Internet of Things');
    // console.log({ data }, { count });

    // const { data, error } = await supabase
    //   .from('technology_projects')
    //   .select()
    //   .eq('name', 'Artificial Intelligence')
    //   .limit(3);
    // console.log({ data }, { error });
    // blops.forEach(async (e) => {
    //   const slug = e.Technology.toLowerCase().split(' ').join('-');
    //   const { data, error } = await supabase
    //     .from('technologies')
    //     .select('id')
    //     .eq('slug', slug);
    //   data.forEach(async (element) => {
    //     const payload = {
    //       technology_id: element.id,
    //       project_id: Number(e.id)
    //     };
    // const { data, error } = await supabase
    //   .from('technology_associations')
    //   .insert(payload);
    // console.log({ data }, { error });
    // });
  };

  useEffect(() => {
    // Parse local CSV file
    // Papa.parse(csvData, {
    //   delimiter: ',',
    //   download: true,
    //   header: true,
    //   complete: function (results) {
    //     const blops = results.data;
    //     // fetch(blops);
    //     // migrate(blops);
    //     update(blops);
    //   }
    // });
    fetch();
  }, []);

  const transform = (arr) => {
    return `{${arr.join(', ')}}`;
  };

  const migrate = async (blops) => {
    blops.forEach(async (b) => {
      const payload = {
        technology_id,
        project_id
      };

      const { data, error } = await supabase
        .from('technology_associations')
        .insert(payload);
      console.log({ data }, { error });
    });
  };

  return (
    <div className='homePage'>
      {blips.length && (
        <div className='projectsShowcase'>
          {[blips[97], blips[34], blips[67]].map((project, idx) => (
            <React.Fragment key={idx}>
              <div className='homeImage'>
                <img
                  src={
                    project['Image Url'].length > 0
                      ? `${project['Image Url']}`
                      : fallBackImage
                  }
                  onError={(e) => {
                    // @ts-expect-error
                    e.target.src = fallBackImage;
                  }}
                  alt='Default Image'
                />
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
      <div className='aboutSection'>
        <Link className='aboutTitle' to='/about'>
          About Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR)
        </Link>
        <span className='aboutDetails'>{aboutContentList[0].description}</span>
      </div>
    </div>
  );
};
