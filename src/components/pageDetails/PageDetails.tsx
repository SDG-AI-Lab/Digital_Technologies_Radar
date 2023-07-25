import React, { useState } from 'react';

import { Image } from 'components/shared/image/Image';
import './PageDetails.scss';
import cx from 'classnames';

interface Props {
  item: Record<string, string | string[]>;
}

export const PageDetails: React.FC<Props> = ({ item }) => {
  const [selectedSection, setSelectedSection] = useState<string>('overview');

  const { source, img_url: imgUrl, name, sections = ['overview'] } = item;

  const handleScroll = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView();
    }
  };

  return (
    <div className='pageDetails'>
      <div className='itemHero'>
        <div className='itemTitle'>
          <span>{name}</span>
          {source && (
            <a
              href={source as string}
              target='_blank'
              rel='noopener noreferrer'
              className='seeitem'
            >
              SUPPORT RECOVERY
            </a>
          )}
        </div>
        <div className='itemImg'>
          <Image imgUrl={imgUrl as string} />
        </div>
      </div>

      <div className='itemBody'>
        <div className='itemToc'>
          {(sections as string[]).map((section: string, idx: number) => (
            <a
              className={cx({ bolden: selectedSection === section })}
              key={idx}
              onClick={() => {
                handleScroll(section.replace(/\s+/g, '_'));

                setSelectedSection(section);
              }}
            >
              {section.toLocaleUpperCase()}
            </a>
          ))}
        </div>
        <div className='itemContent'>
          {(sections as string[]).map((section: string, idx: number) => (
            <div key={idx}>
              <section id={section.replace(/\s+/g, '_')}>
                <span className='itemDetailsTitle'>
                  {section.toLocaleUpperCase()}
                </span>

                <p className='itemDetailsContent'>{item[section]}</p>
              </section>
              <hr className='separater' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
