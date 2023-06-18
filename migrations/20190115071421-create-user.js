'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      avatar: {
        type: Sequelize.STRING,
        defaultValue: 'https://i.imgur.com/PiJ0HXw.png',
      },
      introduction: {
        type: Sequelize.TEXT,
      },
      role: {
        type: Sequelize.STRING,
      },
      account: {
        type: Sequelize.STRING,
      },
      cover: {
        type: Sequelize.STRING,
        defaultValue: 'https://s3-alpha-sig.figma.com/img/1265/d31f/09dfbb2c34f7c30a9d0df9e86817b817?Expires=1687737600&Signature=fil1xkoozx6hjgSydnjP8m5gt9~RXSTYRD0RhFagvKjtokXnooTOIQhBSEDJiBmZshMqm2pLS6BFFTqTYV3I4YFoXi~UApFywoL3F57GWV8uhXqgNvDlq9G4xqWmA~MEulMUhig4pVw1G-kcRb36n999XrJ8B0kVHSjoQZx08DZ1LHnsSLPYSoteAqY-b4Cd3zyTD-ne-w4zez6sBWi221J-jlUByZE4BnCMVRqmEVkIZg3uB2G9nluZtVezO2oRkZQ0ILrN8LJAFBWVhlQ8grlUeNQsJlMI5dtiqeJotAnAPD8RU0z-Df3tiY1EVmZom~iX55jHKYM~~l9niLc7YA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users')
  },
}
