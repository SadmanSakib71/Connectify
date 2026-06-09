import {
  friendReq,
  profile1,
  people1,
  people2,
  people3,
  feedEvent1,
} from './images';

export const notifications = [
  { id: 1, image: friendReq, name: 'Steve Jobs', text: 'posted a link in your timeline.', time: '42 miniutes ago' },
  { id: 2, image: profile1, name: 'Freelacer usa', text: 'An admin changed the name of the group Freelacer usa to Freelacer usa', time: '42 miniutes ago', isGroupChange: true },
  { id: 3, image: friendReq, name: 'Steve Jobs', text: 'posted a link in your timeline.', time: '42 miniutes ago' },
  { id: 4, image: profile1, name: 'Freelacer usa', text: 'An admin changed the name of the group Freelacer usa to Freelacer usa', time: '42 miniutes ago', isGroupChange: true },
  { id: 5, image: friendReq, name: 'Steve Jobs', text: 'posted a link in your timeline.', time: '42 miniutes ago' },
  { id: 6, image: profile1, name: 'Freelacer usa', text: 'An admin changed the name of the group Freelacer usa to Freelacer usa', time: '42 miniutes ago', isGroupChange: true },
  { id: 7, image: friendReq, name: 'Steve Jobs', text: 'posted a link in your timeline.', time: '42 miniutes ago' },
  { id: 8, image: profile1, name: 'Freelacer usa', text: 'An admin changed the name of the group Freelacer usa to Freelacer usa', time: '42 miniutes ago', isGroupChange: true },
  { id: 9, image: friendReq, name: 'Steve Jobs', text: 'posted a link in your timeline.', time: '42 miniutes ago' },
];

export const suggestedPeople = [
  { id: 1, image: people1, name: 'Steve Jobs', role: 'CEO of Apple' },
  { id: 2, image: people2, name: 'Ryan Roslansky', role: 'CEO of Linkedin' },
  { id: 3, image: people3, name: 'Dylan Field', role: 'CEO of Figma' },
];

export const events = [
  { id: 1, image: feedEvent1, day: '10', month: 'Jul', title: 'No more terrorism no more cry', going: '17 People Going' },
  { id: 2, image: feedEvent1, day: '10', month: 'Jul', title: 'No more terrorism no more cry', going: '17 People Going' },
];

export const friends = [
  { id: 1, image: people1, name: 'Steve Jobs', role: 'CEO of Apple', inactive: true, time: '5 minute ago' },
  { id: 2, image: people2, name: 'Ryan Roslansky', role: 'CEO of Linkedin', online: true },
  { id: 3, image: people3, name: 'Dylan Field', role: 'CEO of Figma', online: true },
  { id: 4, image: people1, name: 'Steve Jobs', role: 'CEO of Apple', inactive: true, time: '5 minute ago' },
  { id: 5, image: people2, name: 'Ryan Roslansky', role: 'CEO of Linkedin', online: true },
  { id: 6, image: people3, name: 'Dylan Field', role: 'CEO of Figma', online: true },
  { id: 7, image: people3, name: 'Dylan Field', role: 'CEO of Figma', online: true },
  { id: 8, image: people1, name: 'Steve Jobs', role: 'CEO of Apple', inactive: true, time: '5 minute ago' },
];

export const timelinePosts = [
  { id: 1, showDropdown: true },
  { id: 2, showDropdown: false },
];
