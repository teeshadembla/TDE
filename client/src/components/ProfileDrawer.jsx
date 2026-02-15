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
import {Link, useNavigate} from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DataProvider from '../context/DataProvider';

const Menu = styled(MenuIcon)`
  margin-top : 4px;
  `

const Sidebar = styled(Box)`
  background-color: black;
`


export default function ProfileDrawer() {
  const [open, setOpen] = React.useState(false);
  const {account, setAccount} = React.useContext(DataProvider.DataContext);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const goToProfile = () =>{
    {
      account.role === "core"  ? navigate("/admin/profile") : navigate("/user/profile");

    }
  }

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List sx={{ fontFamily: 'Montserrat' }}>
        <ListItem><h1>{account.name}</h1></ListItem>
        <Divider sx={{borderColor: 'white'}}/>
        <ListItem>{account.email}</ListItem>
        <ListItem button component={Link} to="/events">Upcoming events</ListItem>
        <ListItem><button className='cursor-pointer' onClick={goToProfile}>Dashboard</button></ListItem>
        <ListItem><button className='cursor-pointer' onClick={() => navigate("/settings")}>Account Settings</button></ListItem>
      </List>
      <List>
        
      </List>
    </Box>
  );

  return (
    <div className='w-10 mb-1 ml-1'>
      <Button onClick={toggleDrawer(true)}><AccountCircleIcon sx={{color: "white"}} fontSize='large'></AccountCircleIcon></Button>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)} PaperProps={{
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
