// import sequelize 
import { Sequelize } from "sequelize";
// import connection 
import database from "../config/database.js";

export const User = database.define('users', {
    id: {
        primaryKey: true,
        type: Sequelize.STRING,
    },
    name: Sequelize.STRING,
    telp: Sequelize.STRING,
    password: Sequelize.STRING,
    token: Sequelize.STRING
});

export const Device = database.define('devices', {
    device_id: {
        primaryKey: true,
        type: Sequelize.STRING,
    },
    name: Sequelize.STRING,
    telp: Sequelize.STRING,
    user_id: Sequelize.STRING,
    api_key: Sequelize.STRING,
    webhook: Sequelize.STRING,
    webhook_group: Sequelize.STRING,
    expired_at: Sequelize.STRING,
    device_status: Sequelize.STRING
});

export const Order = database.define('orders', {
    order_id: {
        primaryKey: true,
        type: Sequelize.STRING,
    },
    device_id: Sequelize.STRING,
    total_payment: Sequelize.STRING,
    subtotal: Sequelize.STRING,
    unique_code: Sequelize.STRING,
    payment_status: Sequelize.STRING,
    order_at: Sequelize.STRING,
    due_at: Sequelize.STRING,
    user_id: Sequelize.STRING
});

export const DetailOrder = database.define('detail_orders', {
    order_id: {
        primaryKey: true,
        type: Sequelize.STRING,
    },
    product_id: Sequelize.STRING,
    price: Sequelize.STRING,
    quantity: Sequelize.STRING
});

export const Product = database.define('products', {
    product_id: {
        primaryKey: true,
        type: Sequelize.STRING,
    },
    name: Sequelize.STRING,
    price: Sequelize.STRING,
    detail_features: Sequelize.STRING
});

export const Config = database.define('config', {
    key: {
        primaryKey: true,
        type: Sequelize.STRING,
    },
    value: Sequelize.STRING
});

<<<<<<< HEAD
export const Contact = database.define('contact', {
    contact_id: Sequelize.STRING,
=======
export const Contact = database.define('contacts', {
    contact_id: {
        primaryKey: true,
        type: Sequelize.STRING
    },
>>>>>>> c3978d050596ed426565d9e9a57138f473689694
    folder_contact_id: Sequelize.STRING,
    name: Sequelize.STRING,
    telp: Sequelize.STRING,
    profile_picture: Sequelize.STRING
});

<<<<<<< HEAD
export const FolderContact = database.define('folder_contact', {
=======
export const FolderContact = database.define('folder_contacts', {
>>>>>>> c3978d050596ed426565d9e9a57138f473689694
    folder_contact_id: {
        primaryKey: true,
        type: Sequelize.STRING
    },
    name: Sequelize.STRING,
    is_active: Sequelize.STRING,
    user_id: Sequelize.STRING
});