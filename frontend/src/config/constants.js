export const BOYS_HOSTELS = [
  'Sapphire',
  'Emerald',
  'Ruby',
  'Diamond',
  'Coral',
  'Pearl'
];

export const GIRLS_HOSTELS = [
  'Ganga',
  'Yamuna',
  'Narmadha',
  'Cauvery',
  'North Bhavani',
  'South Bhavani',
  'Old Bhavani'
];

export const HOSTEL_OPTIONS = [
  ...BOYS_HOSTELS,
  ...GIRLS_HOSTELS
];

export const MESS_SECTIONS = ['Boys', 'Girls'];

export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

export const STATUS_COLORS = {
  approved: 'badge-success',
  pending: 'badge-warning',
  collected: 'badge-info',
  rejected: 'badge-danger',
  cancelled: 'badge-secondary',
  open: 'badge-success',
  closed: 'badge-secondary',
  tie: 'badge-warning'
};
