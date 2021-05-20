/* eslint-disable no-use-before-define */
/* eslint-disable import/prefer-default-export */
import shortId from 'shortid';
import faker from 'faker';

export const generateDummyUser = () => ({
  id: shortId.generate(),
  nickname: faker.name.findName(),
  email: faker.internet.email(),
  description: faker.lorem.text(200),
  avatar: 'https://source.unsplash.com/user/avatar/100x100',
});

export const generateDummyComment = () => ({
  id: shortId.generate(),
  User: generateDummyUser(),
  content: faker.lorem.sentence(),
  createAt: faker.date.recent(),
  sub:
    Math.random() > 0.5
      ? [generateDummyComment(), generateDummyComment()]
      : null,
});

export const generateDummyPostImage = () => ({
  id: shortId.generate(),
  title: faker.lorem.word(10),
  src: 'https://source.unsplash.com/user/erondu/1600x900',
});

export const generateDummyTags = (number) =>
  Array(number)
    .fill()
    .map(() => ({
      id: shortId.generate(),
      name: faker.lorem.words(1),
    }));

export const generateDummyPost = () => ({
  id: shortId.generate(),
  User: generateDummyUser(),
  title: faker.lorem.word(Math.random() * 30 - 10),
  content: faker.lorem.paragraph(50),
  Images: Array(parseInt(Math.random() * 4 + 1, 10))
    .fill()
    .map(() => generateDummyPostImage()),
  Tag: generateDummyTags(3),
  Comments: generateDummyComments(3),
});

export const generateDummyComments = (number) =>
  Array(number)
    .fill()
    .map(() => generateDummyComment());

export const generateDummyPosts = (number) =>
  Array(number)
    .fill()
    .map(() => generateDummyPost());
