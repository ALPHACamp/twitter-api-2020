// Translation MySQL 1/0 to true/false
const booleanTranslation = (data) => {
  return (data = !!data)
}

module.exports = booleanTranslation
