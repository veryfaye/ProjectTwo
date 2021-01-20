module.exports = function(sequelize, DataTypes) {
  const Score = sequelize.define("Score", {
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });

  Score.associate = function(models) {
    // We're saying that a Score should belong to an Author
    // A Score can't be created without an Author due to the foreign key constraint
    Score.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Score;
};
