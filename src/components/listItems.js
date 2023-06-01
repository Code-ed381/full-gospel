import * as React from 'react';
import { Link } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import PaidIcon from '@mui/icons-material/Paid';
import ChurchIcon from '@mui/icons-material/Church';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RecommendIcon from '@mui/icons-material/Recommend';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CollectionsIcon from '@mui/icons-material/Collections';
import PodcastsRoundedIcon from '@mui/icons-material/PodcastsRounded';


export const mainListItems = (
  <React.Fragment>
    <Link to='dashboard' style={{ textDecoration: 'none', color: '#000' }}>
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
    </Link>
    <Link to='events' style={{ textDecoration: 'none', color: '#000'  }}>
      <ListItemButton>
        <ListItemIcon>
          <EventIcon />
        </ListItemIcon>
        <ListItemText primary="Events" />
      </ListItemButton>
    </Link>
    <Link to='chapters' style={{ textDecoration: 'none', color: '#000'  }}>
      <ListItemButton>
        <ListItemIcon>
          <ChurchIcon />
        </ListItemIcon>
        <ListItemText primary="Chapters" />
      </ListItemButton>
    </Link>
    <Link to='users' style={{ textDecoration: 'none', color: '#000'  }}>
      <ListItemButton>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItemButton>
    </Link>
    <Link to='sponsors' style={{ textDecoration: 'none', color: '#000'  }}>
      <ListItemButton>
        <ListItemIcon>
          <PaidIcon />
        </ListItemIcon>
        <ListItemText primary="Sponsors" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Socials
    </ListSubheader>
    <Link to='testimonies' style={{ textDecoration: 'none', color: '#000'  }}>
      <ListItemButton>
        <ListItemIcon>
          <RecommendIcon />
        </ListItemIcon>
        <ListItemText primary="Testimonies" />
      </ListItemButton>
    </Link>
    <Link to='news' style={{ textDecoration: 'none', color: '#000'  }}>
      <ListItemButton>
        <ListItemIcon>
          <NewspaperIcon />
        </ListItemIcon>
        <ListItemText primary="News" />
      </ListItemButton>
    </Link>
    <Link to='gallery' style={{ textDecoration: 'none', color: '#000'  }}>
      <ListItemButton>
        <ListItemIcon>
          <CollectionsIcon />
        </ListItemIcon>
        <ListItemText primary="Gallery" />
      </ListItemButton>
    </Link>
    <Link to='podcast' style={{ textDecoration: 'none', color: '#000'  }}>
      <ListItemButton>
        <ListItemIcon>
          <PodcastsRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="Podcast" />
      </ListItemButton>
    </Link>
    {/* <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton> */}
  </React.Fragment>
);
