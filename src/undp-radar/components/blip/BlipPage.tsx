/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';

import { UnorderedList } from '../shared/UnorderedList';
import { SelectionState } from '../../components/shared/SelectionState';

import './BlipPage.scss';

export const BlipPage: React.FC = () => (
  <SelectionState>
    {({ selectedItem, logic: { setSelectedItem }, keys, radarData }) => (
      <div>
        {selectedItem && (
          <div>
            <div style={{ position: 'absolute', top: 20, left: 0 }}>
              <button
                type='button'
                onClick={() => setSelectedItem(null)}
                className={'blipPageButton'}
              >
                <span style={{ fontSize: 30 }}>&#10094;</span>
              </button>
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ justifyContent: 'center', flex: 1 }}>
                <h1 className={'title'}>{selectedItem[keys.titleKey]}</h1>
              </div>
            </div>

            <div style={{ display: 'flex' }} className={'wrapper'}>
              <div style={{ flexDirection: 'column', flex: 1 }}>
                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Title</h4>
                  <div className={'paragraph'}>
                    {selectedItem[keys.titleKey]}
                  </div>
                </div>
                {/* <div style={{ flexDirection: 'row', flex: 1 }}>
                <h4>Summary</h4>
                <div className={'paragraph'}>{selectedItem.Summary}</div>
              </div> */}

                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Description</h4>
                  <div className={'paragraph'}>{selectedItem.Description}</div>
                </div>
                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Level of implementation</h4>
                  <div className={'paragraph'}>
                    {selectedItem[keys.horizonKey]}
                  </div>
                </div>

                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Description</h4>
                  <div className={'paragraph'}>{selectedItem.Description}</div>
                </div>
                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Un Host Organisation</h4>
                  <div className={'paragraph'}>
                    {selectedItem['Un Host Organisation']}
                  </div>
                </div>

                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Technology</h4>
                  <div className={'paragraph'}>
                    <UnorderedList
                      array={selectedItem.Technology}
                      itemStyle={{ display: 'flex', marginBottom: 2 }}
                    >
                      {(item) => {
                        const backgroundColor = radarData.tech.find(
                          (t) => t.type === item
                        )?.color;
                        return (
                          <React.Fragment>
                            <div
                              style={{
                                backgroundColor,
                                width: 20,
                                height: 20,
                                marginRight: 10,
                                marginLeft: 20
                              }}
                            />
                            {item}
                          </React.Fragment>
                        );
                      }}
                    </UnorderedList>
                  </div>
                </div>
                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Data</h4>
                  <div className={'paragraph'}>{selectedItem.Data}</div>
                </div>
              </div>

              <div style={{ flexDirection: 'column', flex: 1 }}>
                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Use case</h4>
                  <div className={'paragraph'}>{selectedItem['Use Case']}</div>
                </div>

                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Source</h4>
                  <div className={'paragraph'}>
                    {selectedItem.Source === 'No Information' &&
                      selectedItem.Source}
                    {selectedItem.Source !== 'No Information' && (
                      <a
                        href={selectedItem.Source}
                        target='_blank'
                        rel='noreferrer'
                      >
                        {selectedItem.Source}
                      </a>
                    )}
                  </div>
                </div>
                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>SDG goal(s)</h4>
                  <div className={'paragraph'}>
                    <UnorderedList array={selectedItem.SDG} />
                  </div>
                </div>
                {/* <div style={{ flexDirection: 'row', flex: 1 }}>
                <h4>Organization</h4>
                <div className={'paragraph'}>{selectedItem.Organization}</div>
              </div>

              <div style={{ flexDirection: 'row', flex: 1 }}>
                <h4>Developer</h4>
                <div className={'paragraph'}>{selectedItem.Developer}</div>
              </div> */}

                {/* <div style={{ flexDirection: 'row', flex: 1 }}>
                <h4>Implementer</h4>
                <div className={'paragraph'}>{selectedItem.Implementer}</div>
              </div> */}

                <div style={{ flexDirection: 'row', flex: 1 }}>
                  <h4>Partner</h4>
                  <div className={'paragraph'}>
                    {selectedItem['Supporting Partners']}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )}
  </SelectionState>
);
