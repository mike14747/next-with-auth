// import { connectToDatabase } from '../../lib/mongodb';
// import { ObjectId } from 'mongodb';

const getUnprotectedData = async () => {
    return new Promise((resolve, reject) => {
        resolve([
            {
                name: 'Bob',
            },
            {
                name: 'Grace',
            },
        ]);
    });
};

const getProtectedData = async () => {
    return new Promise((resolve, reject) => {
        resolve([
            {
                name: 'Bob',
                age: 32,
            },
            {
                name: 'Grace',
                age: 25,
            },
        ]);
    });
};

const getAdminData = async () => {
    return new Promise((resolve, reject) => {
        resolve([
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
        ]);
    });
};

module.exports = {
    getUnprotectedData,
    getProtectedData,
    getAdminData,
};
