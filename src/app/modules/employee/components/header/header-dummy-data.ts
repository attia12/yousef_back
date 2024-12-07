import { Subject } from 'rxjs';

export const languages = [
  {
    language: 'English',
    flag: 'us',
  },
  {
    language: 'French',
    flag: 'france',
  },
  // {
  //   language: 'German',
  //   flag: 'germany',
  // },
  // {
  //   language: 'Russian',
  //   flag: 'russia',
  // },
  // {
  //   language: 'Spanish',
  //   flag: 'spain',
  // },
];

export const notifications = [
  {
    icon: 'far fa-cloud-download',
    Subject: 'Download complete',
    description: 'Lorem ipsum dolor sit amet, consectetuer',
  },

  {
    icon: 'far fa-cloud-upload',
    Subject: 'Upload complete',
    description: 'Lorem ipsum dolor sit amet, consectetuer',
  },

  {
    icon: 'far fa-trash',
    Subject: '350 MB trash files',
    description: 'Lorem ipsum dolor sit amet, consectetuer',
  },
];

export const userItems = [
  {
    icon: 'far fa-user',
    label: 'Profile',
    routeLink: '/profile',
  },
];
