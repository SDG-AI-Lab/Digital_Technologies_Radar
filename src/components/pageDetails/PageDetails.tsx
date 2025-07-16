import React, { useState, useEffect } from 'react';

import { Image } from 'components/shared/image/Image';
import './PageDetails.scss';
import cx from 'classnames';
import { Loader } from 'helpers/Loader';
import { Button } from '@chakra-ui/react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from 'helpers/databaseClient';
import { updateDataVersion } from 'helpers/dataUtils';
import { isAdmin } from 'components/shared/helpers/auth';
import { toSnakeCase } from 'components/shared/helpers/HelperUtils';

interface Props {
  item: Record<string, string | string[] | number>;
  sections: string[];
  loading: boolean;
}

export const PageDetails: React.FC<Props> = ({
  item,
  sections = ['overview'],
  loading
}) => {
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const [itemDetails, setItemDetails] = useState<any>({});
  const [helpNeeded, setHelpNeeded] = useState<boolean>(false);

  useEffect(() => {
    if (Object.keys(item).length) {
      setItemDetails(item);
      setHelpNeeded(item.help_needed === 1);
    }
  }, [item]);

  const handleScroll = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView();
    }
  };

  const formatArrayItems = (itemDetals: any[]) => {
    if(Array.isArray(itemDetals)) {
      return itemDetals.join(", ")
    }

    return itemDetals
  }

  const handleEdit = (): void => {
    navigate(`${path}/edit?recent=${helpNeeded as unknown as string}`);
  };

  const handleDelete = async (): Promise<void> => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const { error } = await supabase
      .from('disaster_events')
      .delete()
      .eq('uuid', item.uuid);

    if (error) {
      alert('There was an error. Please try again');
    } else {
      void updateDataVersion();
      localStorage.removeItem('drr-recent-disasters');
      alert('Deleted successfully');
      navigate('/');
    }
  };

  return !loading ? (
    <div className='pageDetails'>
      <div className='itemHero'>
        <div className='itemTitle'>
          <span>{itemDetails?.title}</span>
          {itemDetails?.source && helpNeeded && (
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
      {isAdmin && (
        <div className='actions'>
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
              void handleDelete();
            }}
          >
            Delete
          </Button>
        </div>
      )}

      <div className='itemBody'>
        <div className='itemToc'>
          {sections
            .filter(
              (section) => section.toLowerCase() !== 'how to help' || helpNeeded
            )
            .map((section: string, idx: number) => (
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
          {sections.map((section: string, idx: number) => {
            const lowerCaseSection = section.toLowerCase();

            if (lowerCaseSection === 'how to help' && !helpNeeded) {
              return null;
            }

            return (
              <div key={idx}>
                <section id={section.replace(/\s+/g, '_')}>
                  <span className='itemDetailsTitle'>
                    {section.toLocaleUpperCase()}
                  </span>
                  <p className='itemDetailsContent'>
                    {formatArrayItems(itemDetails[toSnakeCase(section)])}
                  </p>
                </section>
                <hr className='separater' />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    <Loader rows={3} />
  );
};
