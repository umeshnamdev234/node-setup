module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', 
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        underscored: true,
        timestamps: false,
    });
    return User;
}