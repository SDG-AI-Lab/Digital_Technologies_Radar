import background from 'assets/landing/background2.jpg';

interface CarouselItem {
  img_url: string;
  label: string;
  route: string;
}

export const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    img_url: background,
    label:
      'Projects page lists all the captured projects so far with links to see more details of each project',
    route: '#/projects'
  },
  {
    img_url:
      'https://plus.unsplash.com/premium_photo-1671974490050-2d19bed9f522?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    label:
      'The Disasters Page has a list of disater types, each showing projects associated with that disaster.',
    route: '/#/disasters'
  },
  {
    img_url:
      'https://plus.unsplash.com/premium_photo-1664298145390-fa6018ad4093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1086&q=80',
    label:
      'Find a list of technologies used in combating disaters in the technologies page. Each row includes projects in which that technology was used.',
    route: '/#/technologies'
  }
];
