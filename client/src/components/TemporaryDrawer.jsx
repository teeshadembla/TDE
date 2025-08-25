import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import {Link} from 'react-router-dom';

const Menu = styled(MenuIcon)`
  margin-top : 4px;
  `

const Sidebar = styled(Box)`
  background-color: black;
`


export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List sx={{ fontFamily: 'Montserrat' }}>
        <ListItem button component={Link} to="/centreForExcellence">Centre for Excellence</ListItem>
        <ListItem button component={Link} to="/execFellowship">Executive Fellowship</ListItem>
{/*         <ListItem >Responsible AI</ListItem>
        <ListItem button component={Link} to="/values">Values</ListItem> */}
{/*         <ListItem button component={Link} to="/genesis">Genesis</ListItem>
        <ListItem button component={Link} to="/davos-launch">Davos Launch</ListItem> */}
        <ListItem button component={Link} to="/our-people">People at The Digital Economist</ListItem>
{/*         <ListItem button component={Link} to="/advisory">Advisory</ListItem>
        <ListItem button component={Link} to="/speaker-series">Speaker series</ListItem> */}
        <Divider sx={{borderColor: 'white'}}/>
        <ListItem><a href='https://www.techfortransparency.com/' target="_blank">Tech For Transparency</a></ListItem>
        <ListItem><a href='https://www.ostromproject.com/'  target="_blank">Ostrom Project</a></ListItem>
        <ListItem><a href='https://www.aner-g.com/' target="_blank">ANER-G</a></ListItem>
        <ListItem><a href='https://www.africacoalition.com/' target="_blank">Africa Coalition</a></ListItem>
      </List>
      <List>
        
      </List>
    </Box>
  );

  return (
    <div className='w-10 mt-5 ml-1'>
      <Button onClick={toggleDrawer(true)}><Menu sx={{color: "white"}} fontSize='large'></Menu></Button>
      <Drawer open={open} onClose={toggleDrawer(false)} PaperProps={{
          sx: {
            backgroundColor: 'black',
            color: 'white',
          },
        }}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
