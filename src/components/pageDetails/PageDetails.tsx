import React, { useState, useEffect } from 'react';

import { Image } from 'components/shared/image/Image';
import './PageDetails.scss';
import cx from 'classnames';
import { Loader } from 'helpers/Loader';

interface Props {
  item: Record<string, string | string[]>;
  sections: string[];
  loading: boolean;
}

export const PageDetails: React.FC<Props> = ({
  item,
  sections = ['overview'],
  loading
}) => {
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const [itemDetails, setItemDetails] = useState<any>({});

  useEffect(() => {
    if (Object.keys(item).length) {
      setItemDetails(item);
    }
  }, [item]);

  const handleScroll = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView();
    }
  };

  return !loading ? (
    <div className='pageDetails'>
      <div className='itemHero'>
        <div className='itemTitle'>
          <span>{itemDetails?.title}</span>
          {itemDetails?.source && (
            <a
              href={itemDetails?.source as string}
              target='_blank'
              rel='noopener noreferrer'
              className='seeitem'
            >
              SUPPORT RECOVERY
            </a>
          )}
        </div>
        <div className='itemImg'>
          <Image imgUrl={itemDetails?.img_url as string} />
        </div>
      </div>

      <div className='itemBody'>
        <div className='itemToc'>
          {sections.map((section: string, idx: number) => (
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
          {sections.map((section: string, idx: number) => (
            <div key={idx}>
              <section id={section.replace(/\s+/g, '_')}>
                <span className='itemDetailsTitle'>
                  {section.toLocaleUpperCase()}
                </span>

                <p className='itemDetailsContent'>{itemDetails[section]}</p>
              </section>
              <hr className='separater' />
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <Loader rows={3} />
  );
};
