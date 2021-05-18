/* eslint-disable import/prefer-default-export */
import shortId from 'shortid';
import faker from 'faker';

export const generateDummyPost = (number) =>
  Array(number)
    .fill()
    .map(() => ({
      id: shortId.generate(),
      User: {
        id: shortId.generate(),
        nickname: faker.name.findName(),
        avatar: 'https://source.unsplash.com/user/avatar/100x100',
      },
      title: faker.lorem.word(Math.random() * 30 - 10),
      content: faker.lorem.paragraph(),
      Images: [
        {
          src: 'https://source.unsplash.com/user/erondu/1600x900',
        },
      ],
      Comments: [
        {
          User: {
            id: shortId.generate(),
            nickname: faker.name.findName(),
          },
          content: faker.lorem.sentence(),
        },
      ],
    }));
