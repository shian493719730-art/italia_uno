// Test helper (not a test file): "The Postcard That Fell" played the intended way, opening to clean plate.
export const STORY_PATH = [
  { type: 'STORY_START' },
  { type: 'QUIZ_ANSWER', answer: 'bari' },
  { type: 'PACK_TOGGLE', id: 'coffee-pot' }, { type: 'PACK_TOGGLE', id: 'scarf' }, { type: 'PACK_TOGGLE', id: 'photo' }, { type: 'PACK_CONFIRM' },
  { type: 'CHAPTER_COMPLETE' },
  { type: 'QUIZ_ANSWER', answer: 'soho' },
  { type: 'SERVE_MATCH', item: 'espresso' }, { type: 'SERVE_MATCH', item: 'cappuccino' }, { type: 'SERVE_MATCH', item: 'panino' },
  { type: 'CHAPTER_COMPLETE' },
  { type: 'QUIZ_ANSWER', answer: 'napoli' },
  ...['scarf', 'ball', 'cup', 'flag', 'panino'].map(id => ({ type: 'FIND_ITEM', id })),
  { type: 'CHAPTER_COMPLETE' },
  { type: 'POSTCARD_SET', to: 'mum', sticker: 'espresso', note: 'Dear Mum, let’s go to Italia Uno together.' },
  { type: 'CHAPTER_COMPLETE' },
];
// reduce(customer, action) → customer. Works with reduceCustomer directly.
export const playStory = (c, reduce, actions = STORY_PATH) => actions.reduce(reduce, c);
