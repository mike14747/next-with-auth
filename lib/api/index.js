// import { connectToDatabase } from '../../lib/mongodb';
// import { ObjectId } from 'mongodb';

const getUnprotectedData = async () => {
    return [
        {
            name: 'Bob',
        },
        {
            name: 'Grace',
        },
    ];
};

const getProtectedData = async () => {
    return [
        {
            name: 'Bob',
            age: 32,
        },
        {
            name: 'Grace',
            age: 25,
        },
    ];
};

const getAdminData = async () => {
    return [
        {
            name: 'Bob',
            age: 32,
            salary: 42000,
        },
        {
            name: 'Grace',
            age: 25,
            salary: 34000,
        },
    ];
};

module.exports = {
    getUnprotectedData,
    getProtectedData,
    getAdminData,
};
