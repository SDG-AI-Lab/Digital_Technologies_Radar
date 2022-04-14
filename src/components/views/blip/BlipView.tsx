import { FC, useEffect, useState, useMemo } from 'react';

import Box from '@mui/material/Box/Box';
import Modal from '@mui/material/Modal/Modal';
import Paper from '@mui/material/Paper/Paper';
import Table from '@mui/material/Table/Table';
import Badge from '@mui/material/Badge/Badge';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button/Button';
import TableRow from '@mui/material/TableRow/TableRow';
import TableHead from '@mui/material/TableHead/TableHead';
import TableCell from '@mui/material/TableCell/TableCell';
import { useRadarState } from '@undp_sdg_ai_lab/undp-radar';

import { StackMui } from '../../../ui/components/VStackMui';
import Link from '@mui/material/Link/Link';
import { Typography } from '@mui/material';

const style: React.CSSProperties = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
  // width: 400,
  // bgcolor: 'background.paper',
  // border: '2px solid #000',
};

export const BlipView: FC = () => {
  const {
    state: { selectedItem },
    actions: { setSelectedItem }
  } = useRadarState();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    if (selectedItem != null) handleOpen();
  }, [selectedItem]);

  return useMemo(() => {
    // The rest of your rendering logic
    return (
      <>
        {selectedItem && (
          // <Mo
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Paper
              style={{
                ...style,
                maxHeight: '90%',
                maxWidth: '90%',
                overflow: 'auto',
                position: 'relative',
                padding: 10
              }}
            >
              <Typography
                p={2}
                style={{
                  justifyContent: 'center',
                  textAlign: 'center',
                  textTransform: 'capitalize'
                }}
                variant='h5'
              >
                {selectedItem['Ideas/Concepts/Examples']}
              </Typography>
              <Button
                style={{ top: 5, right: 5, position: 'absolute' }}
                onClick={handleClose}
              >
                Close
              </Button>

              <Box>
                <Table
                //  variant='unstyled'
                >
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <StackMui
                          direction='row'
                          style={{
                            justifyContent: 'center'
                          }}
                        >
                          <Badge
                          // px={2}
                          // py={1}
                          // borderRadius='md'
                          // bg='purple.50'
                          // textTransform='capitalize'
                          >
                            📍 {selectedItem['Country of Implementation']}
                          </Badge>
                          <Badge
                          // px={2}
                          // py={1}
                          // borderRadius='md'
                          // bg='green.50'
                          // textTransform='capitalize'
                          >
                            🎯 {selectedItem['SDG']?.join(', ')}
                          </Badge>
                          <Badge
                          // px={2}
                          // py={1}
                          // borderRadius='md'
                          // bg='black'
                          // // color='white'
                          // textTransform='capitalize'
                          >
                            🏠 {selectedItem['Status/Maturity']}
                          </Badge>
                          <Badge
                          // px={2}
                          // py={1}
                          // borderRadius='md'
                          // bg='#2B6CB0'
                          // color='#fff'
                          // textTransform='capitalize'
                          >
                            🌋 {selectedItem['Disaster Cycle']}
                          </Badge>
                        </StackMui>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        Description
                      </TableCell>
                      <TableCell
                        style={{
                          textAlign: 'justify',
                          textJustify: 'inter-word'
                        }}
                      >
                        {selectedItem['Description']}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        Technology
                      </TableCell>
                      <TableCell>
                        {selectedItem['Technology']?.join(', ')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        Disaster Type
                      </TableCell>
                      <TableCell>{selectedItem['Disaster Type']}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        Use Case
                      </TableCell>
                      <TableCell>{selectedItem['Use Case']}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        UN Host Organization
                      </TableCell>
                      <TableCell>
                        {selectedItem['Un Host Organisation']}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        Partner
                      </TableCell>
                      <TableCell>
                        {selectedItem['Supporting Partners']}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        Data
                      </TableCell>
                      <TableCell>{selectedItem['Data']}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        Theme
                      </TableCell>
                      <TableCell>{selectedItem['Theme']}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        Source
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`${selectedItem['Source']}`}
                          // isExternal
                          // color='blue.600'
                          target='_blank'
                          rel='noopener'
                        >
                          Click Here
                        </Link>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ verticalAlign: 'top' }}>
                        Publication Date
                      </TableCell>
                      <TableCell>
                        {selectedItem['Date of Implementation']}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
              {/* <ModalFooter></ModalFooter> */}
            </Paper>
          </Modal>
        )}
      </>
    );
  }, [selectedItem, open, handleClose]);
};
