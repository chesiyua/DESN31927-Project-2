import mongoose from 'mongoose';

export const SIGNUP_CAMPUSES = ['Davis', 'Trafalgar', 'Hazel McCallion'];

export const SIGNUP_ATTENDEE_TYPES = ['Student', 'Staff', 'Guest'];

export const SIGNUP_ACTIVITIES = [
  'Costume Contest',
  'Pumpkin Carving',
  'Horror Movie Night',
  'Haunted House Tour',
];

export const SIGNUP_ARRIVAL_TIMES = ['6:00 PM', '7:00 PM', '8:00 PM'];

export const SIGNUP_FOOD_NEEDS = ['None', 'Vegetarian', 'Halal', 'Nut Allergy', 'Other'];

export const SIGNUP_HOW_HEARD = [
  'Friend or Classmate',
  'Teacher or Class Announcement',
  'Poster on Campus',
  'Instagram or Social Media',
  'Email',
  'Other',
];

export const SIGNUP_ATTENDED_BEFORE = ['Yes', 'No'];

export const SIGNUP_COSTUME_THEMES = [
  'Scary',
  'Movie or Anime Character',
  'Funny',
  'Cute',
  'Original Design',
  'No Costume',
];

export const SIGNUP_CANDY_PREFERENCES = [
  'Chocolate',
  'Gummy Candy',
  'Sour Candy',
  'Chips',
  'Cookies',
  'No Preference',
];

export const SIGNUP_VOLUNTEER_OPTIONS = [
  'No',
  'Yes - Setup Before the Event',
  'Yes - During the Event',
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
      maxlength: [80, 'Name must be 80 characters or fewer.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => EMAIL_PATTERN.test(v),
        message: 'Email must be a valid email address.',
      },
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone must be 20 characters or fewer.'],
      default: '',
    },
    campus: {
      type: String,
      required: [true, 'Campus is required.'],
      enum: {
        values: SIGNUP_CAMPUSES,
        message: 'Campus must be one of: Davis, Trafalgar, Hazel McCallion.',
      },
    },
    attendee_type: {
      type: String,
      required: [true, 'Attendee type is required.'],
      enum: {
        values: SIGNUP_ATTENDEE_TYPES,
        message: 'Attendee type must be one of: Student, Staff, Guest.',
      },
    },
    activity: {
      type: String,
      required: [true, 'Activity is required.'],
      enum: {
        values: SIGNUP_ACTIVITIES,
        message:
          'Activity must be one of: Costume Contest, Pumpkin Carving, Horror Movie Night, Haunted House Tour.',
      },
    },
    guests: {
      type: Number,
      required: [true, 'Number of people is required.'],
      min: [1, 'Number of people must be between 1 and 4.'],
      max: [4, 'Number of people must be between 1 and 4.'],
      validate: {
        validator: (v) => Number.isInteger(v),
        message: 'Number of people must be a whole number between 1 and 4.',
      },
    },
    arrival_time: {
      type: String,
      required: [true, 'Arrival time is required.'],
      enum: {
        values: SIGNUP_ARRIVAL_TIMES,
        message: 'Arrival time must be one of: 6:00 PM, 7:00 PM, 8:00 PM.',
      },
    },
    costume: {
      type: String,
      trim: true,
      maxlength: [200, 'Costume plan must be 200 characters or fewer.'],
      default: '',
    },
    food_needs: {
      type: String,
      enum: {
        values: SIGNUP_FOOD_NEEDS,
        message: 'Food needs must be one of: None, Vegetarian, Halal, Nut Allergy, Other.',
      },
      default: 'None',
    },
    photo_permission: {
      type: Boolean,
      default: false,
    },
    how_heard: {
      type: String,
      required: [true, 'Please tell us how you heard about this event.'],
      enum: {
        values: SIGNUP_HOW_HEARD,
        message:
          'How you heard about the event must be one of: Friend or Classmate, Teacher or Class Announcement, Poster on Campus, Instagram or Social Media, Email, Other.',
      },
    },
    attended_before: {
      type: String,
      required: [true, 'Please say if you have been to a Sheridan Halloween event before.'],
      enum: {
        values: SIGNUP_ATTENDED_BEFORE,
        message: 'Attended before must be one of: Yes, No.',
      },
    },
    costume_theme: {
      type: String,
      enum: {
        values: SIGNUP_COSTUME_THEMES,
        message:
          'Costume theme must be one of: Scary, Movie or Anime Character, Funny, Cute, Original Design, No Costume.',
      },
    },
    candy_preference: {
      type: String,
      enum: {
        values: SIGNUP_CANDY_PREFERENCES,
        message:
          'Candy preference must be one of: Chocolate, Gummy Candy, Sour Candy, Chips, Cookies, No Preference.',
      },
    },
    volunteer: {
      type: String,
      enum: {
        values: SIGNUP_VOLUNTEER_OPTIONS,
        message:
          'Volunteer must be one of: No, Yes - Setup Before the Event, Yes - During the Event.',
      },
      default: 'No',
    },
    accessibility_needs: {
      type: String,
      trim: true,
      maxlength: [200, 'Accessibility needs must be 200 characters or fewer.'],
      default: '',
    },
    suggestions: {
      type: String,
      trim: true,
      maxlength: [500, 'Suggestions must be 500 characters or fewer.'],
      default: '',
    },
  },
  { timestamps: true }
);

// Avoid OverwriteModelError when the function is warmed / re-imported.
export const Signup =
  mongoose.models.Signup || mongoose.model('Signup', signupSchema, 'signups');
