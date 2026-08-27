import fs from 'fs/promises';
import existsFs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

// Initial seed data generator
const SEED_DATA = {
  users: [
    { id: '1', rollNo: 'admin1', password: '$2a$10$wN1D4iVlMsk8nQcTzQ.dNeZlhjH.Yl/9zX3/F9wFp3y5.2E.88E/y', name: 'Mess Supervisor', role: 'admin', hostel: 'All', section: 'All', messType: 'All' },
    { id: '2', rollNo: '221CS101', password: '$2a$10$6R6xG8wD6hS6oZ3i.Yw28.9sT7tN4yZ8gK.5eF7mO2wB9dE0yK5i6', name: 'Aravind Kumar', role: 'student', hostel: 'Sapphire Hostel', section: 'Boys', messType: 'Standard (Veg+Egg)' },
    { id: '3', rollNo: '221IT202', password: '$2a$10$6R6xG8wD6hS6oZ3i.Yw28.9sT7tN4yZ8gK.5eF7mO2wB9dE0yK5i6', name: 'Dharshini R', role: 'student', hostel: 'Ganga Hostel', section: 'Girls', messType: 'Standard (Veg+Egg)' },
    { id: '4', rollNo: '221EC303', password: '$2a$10$6R6xG8wD6hS6oZ3i.Yw28.9sT7tN4yZ8gK.5eF7mO2wB9dE0yK5i6', name: 'Sanjay S', role: 'student', hostel: 'Emerald Hostel', section: 'Boys', messType: 'Standard (Veg+Egg)' }
  ],
  menu: [
    { id: 'm-boys-1', section: 'Boys', day: 'Monday', meal: 'Breakfast', items: 'Idly, Sambar, Coconut Chutney, Vadai, Tea/Coffee', popularity: 8, veg: true },
    { id: 'm-boys-2', section: 'Boys', day: 'Monday', meal: 'Lunch', items: 'White Rice, Bhavani Sambar, Rasam, Beetroot Poriyal, Curd, Appalam', popularity: 6, veg: true },
    { id: 'm-boys-3', section: 'Boys', day: 'Monday', meal: 'Snacks', items: 'Onion Pakoda, Hot Tea/Milk', popularity: 7, veg: true },
    { id: 'm-boys-4', section: 'Boys', day: 'Monday', meal: 'Dinner', items: 'Chappathi, Veg Kurma, Veg Fried Rice, Gravy, Milk', popularity: 8, veg: true },
    { id: 'm-boys-5', section: 'Boys', day: 'Tuesday', meal: 'Breakfast', items: 'Pongal, Sambar, Coconut Chutney, Medu Vadai, Coffee/Tea', popularity: 9, veg: true },
    { id: 'm-boys-6', section: 'Boys', day: 'Tuesday', meal: 'Lunch', items: 'Veg Biryani, Onion Raitha, Potato Chips, Rasam, Curd', popularity: 8, veg: true },
    { id: 'm-boys-7', section: 'Boys', day: 'Tuesday', meal: 'Snacks', items: 'Kozhukattai, Tea/Milk', popularity: 5, veg: true },
    { id: 'm-boys-8', section: 'Boys', day: 'Tuesday', meal: 'Dinner', items: 'Parotta, Paneer Butter Masala, White Rice, Rasam, Milk', popularity: 9, veg: true },
    { id: 'm-boys-9', section: 'Boys', day: 'Wednesday', meal: 'Breakfast', items: 'Poori, Potato Masala, Coconut Chutney, Tea/Coffee', popularity: 8, veg: true },
    { id: 'm-boys-10', section: 'Boys', day: 'Wednesday', meal: 'Lunch', items: 'White Rice, Kara Kuzhambu, Cabbage Poriyal, Rasam, Butter Milk', popularity: 6, veg: true },
    { id: 'm-boys-11', section: 'Boys', day: 'Wednesday', meal: 'Snacks', items: 'Samosa, Hot Tea/Milk', popularity: 9, veg: true },
    { id: 'm-boys-12', section: 'Boys', day: 'Wednesday', meal: 'Dinner', items: 'Dosa, Tomato Chutney, Sambar, Lemon Rice, Milk', popularity: 8, veg: true },
    { id: 'm-boys-13', section: 'Boys', day: 'Thursday', meal: 'Breakfast', items: 'Rava Upma, Coconut Chutney, Sugar, Banana, Coffee/Tea', popularity: 4, veg: true },
    { id: 'm-boys-14', section: 'Boys', day: 'Thursday', meal: 'Lunch', items: 'White Rice, Drumstick Sambar, Keerai Kootu, Potato Fry, Rasam, Curd', popularity: 7, veg: true },
    { id: 'm-boys-15', section: 'Boys', day: 'Thursday', meal: 'Snacks', items: 'Sundal, Hot Tea/Milk', popularity: 6, veg: true },
    { id: 'm-boys-16', section: 'Boys', day: 'Thursday', meal: 'Dinner', items: 'Idiyappam, Coconut Milk, Veg Kurma, White Rice, Rasam, Milk', popularity: 7, veg: true },
    { id: 'm-boys-17', section: 'Boys', day: 'Friday', meal: 'Breakfast', items: 'Semiya Upma, Coconut Chutney, Banana, Tea/Coffee', popularity: 5, veg: true },
    { id: 'm-boys-18', section: 'Boys', day: 'Friday', meal: 'Lunch', items: 'White Rice, Vatha Kuzhambu, Appalam, Carrot Poriyal, Rasam, Curd', popularity: 6, veg: true },
    { id: 'm-boys-19', section: 'Boys', day: 'Friday', meal: 'Snacks', items: 'Bajjis (Banana/Potato), Hot Tea/Milk', popularity: 9, veg: true },
    { id: 'm-boys-20', section: 'Boys', day: 'Friday', meal: 'Dinner', items: 'Naan, Gobi Manchurian, Veg Pulao, Dal Fry, Milk', popularity: 9, veg: true },
    { id: 'm-boys-21', section: 'Boys', day: 'Saturday', meal: 'Breakfast', items: 'Dosa, Sambar, Mint Chutney, Tea/Coffee', popularity: 8, veg: true },
    { id: 'm-boys-22', section: 'Boys', day: 'Saturday', meal: 'Lunch', items: 'Lemon Rice, Curd Rice, Potato Chips, Pickles, Appalam', popularity: 5, veg: true },
    { id: 'm-boys-23', section: 'Boys', day: 'Saturday', meal: 'Snacks', items: 'Biscuits, Rusk, Hot Tea/Milk', popularity: 5, veg: true },
    { id: 'm-boys-24', section: 'Boys', day: 'Saturday', meal: 'Dinner', items: 'Chappathi, Dal Tadka, White Rice, Sambar, Curd, Milk', popularity: 7, veg: true },
    { id: 'm-boys-25', section: 'Boys', day: 'Sunday', meal: 'Breakfast', items: 'Idly, Sambar, Coconut Chutney, Vadai, Halwa, Coffee/Tea', popularity: 9, veg: true },
    { id: 'm-boys-26', section: 'Boys', day: 'Sunday', meal: 'Lunch', items: 'BIT Spl Chicken Biryani (Non-Veg) OR Paneer Biryani (Veg), Raitha, Brinjal Gravy, Ice Cream', popularity: 10, veg: false },
    { id: 'm-boys-27', section: 'Boys', day: 'Sunday', meal: 'Snacks', items: 'Puffs (Egg/Veg), Hot Tea/Milk', popularity: 8, veg: false },
    { id: 'm-boys-28', section: 'Boys', day: 'Sunday', meal: 'Dinner', items: 'Uthappam, Sambar, Chutney, Fried Rice, Tomato Sauce, Milk', popularity: 8, veg: true },

    { id: 'm-girls-1', section: 'Girls', day: 'Monday', meal: 'Breakfast', items: 'Idly, Sambar, Tomato Chutney, Vadai, Tea/Milk', popularity: 8, veg: true },
    { id: 'm-girls-2', section: 'Girls', day: 'Monday', meal: 'Lunch', items: 'White Rice, Kaveri Sambar, Rasam, Cabbage Poriyal, Curd, Appalam', popularity: 6, veg: true },
    { id: 'm-girls-3', section: 'Girls', day: 'Monday', meal: 'Snacks', items: 'Sweet Kozhukattai, Hot Tea/Milk', popularity: 7, veg: true },
    { id: 'm-girls-4', section: 'Girls', day: 'Monday', meal: 'Dinner', items: 'Chappathi, Veg Kurma, Jeera Rice, Milk', popularity: 8, veg: true },
    { id: 'm-girls-5', section: 'Girls', day: 'Tuesday', meal: 'Breakfast', items: 'Pongal, Sambar, Coconut Chutney, Medu Vadai, Coffee/Tea', popularity: 9, veg: true },
    { id: 'm-girls-6', section: 'Girls', day: 'Tuesday', meal: 'Lunch', items: 'Mushroom Biryani, Onion Raitha, Potato Chips, Rasam, Curd', popularity: 8, veg: true },
    { id: 'm-girls-7', section: 'Girls', day: 'Tuesday', meal: 'Snacks', items: 'Methu Vadai, Tea/Milk', popularity: 5, veg: true },
    { id: 'm-girls-8', section: 'Girls', day: 'Tuesday', meal: 'Dinner', items: 'Parotta, Paneer Butter Masala, White Rice, Rasam, Milk', popularity: 9, veg: true },
    { id: 'm-girls-9', section: 'Girls', day: 'Wednesday', meal: 'Breakfast', items: 'Poori, Potato Masala, Coconut Chutney, Tea/Coffee', popularity: 8, veg: true },
    { id: 'm-girls-10', section: 'Girls', day: 'Wednesday', meal: 'Lunch', items: 'White Rice, Poondu Kuzhambu, Beetroot Poriyal, Rasam, Butter Milk', popularity: 6, veg: true },
    { id: 'm-girls-11', section: 'Girls', day: 'Wednesday', meal: 'Snacks', items: 'Samosa, Hot Tea/Milk', popularity: 9, veg: true },
    { id: 'm-girls-12', section: 'Girls', day: 'Wednesday', meal: 'Dinner', items: 'Dosa, Tomato Chutney, Sambar, Lemon Rice, Milk', popularity: 8, veg: true },
    { id: 'm-girls-13', section: 'Girls', day: 'Thursday', meal: 'Breakfast', items: 'Rava Upma, Coconut Chutney, Sugar, Banana, Coffee/Tea', popularity: 4, veg: true },
    { id: 'm-girls-14', section: 'Girls', day: 'Thursday', meal: 'Lunch', items: 'White Rice, Drumstick Sambar, Keerai Kootu, Potato Fry, Rasam, Curd', popularity: 7, veg: true },
    { id: 'm-girls-15', section: 'Girls', day: 'Thursday', meal: 'Snacks', items: 'Sundal, Hot Tea/Milk', popularity: 6, veg: true },
    { id: 'm-girls-16', section: 'Girls', day: 'Thursday', meal: 'Dinner', items: 'Idiyappam, Coconut Milk, Veg Kurma, White Rice, Rasam, Milk', popularity: 7, veg: true },
    { id: 'm-girls-17', section: 'Girls', day: 'Friday', meal: 'Breakfast', items: 'Semiya Upma, Coconut Chutney, Banana, Tea/Coffee', popularity: 5, veg: true },
    { id: 'm-girls-18', section: 'Girls', day: 'Friday', meal: 'Lunch', items: 'White Rice, Vatha Kuzhambu, Appalam, Carrot Poriyal, Rasam, Curd', popularity: 6, veg: true },
    { id: 'm-girls-19', section: 'Girls', day: 'Friday', meal: 'Snacks', items: 'Bajjis (Banana/Potato), Hot Tea/Milk', popularity: 9, veg: true },
    { id: 'm-girls-20', section: 'Girls', day: 'Friday', meal: 'Dinner', items: 'Naan, Gobi Manchurian, Veg Pulao, Dal Fry, Milk', popularity: 9, veg: true },
    { id: 'm-girls-21', section: 'Girls', day: 'Saturday', meal: 'Breakfast', items: 'Dosa, Sambar, Mint Chutney, Tea/Coffee', popularity: 8, veg: true },
    { id: 'm-girls-22', section: 'Girls', day: 'Saturday', meal: 'Lunch', items: 'Lemon Rice, Curd Rice, Potato Chips, Pickles, Appalam', popularity: 5, veg: true },
    { id: 'm-girls-23', section: 'Girls', day: 'Saturday', meal: 'Snacks', items: 'Biscuits, Rusk, Hot Tea/Milk', popularity: 5, veg: true },
    { id: 'm-girls-24', section: 'Girls', day: 'Saturday', meal: 'Dinner', items: 'Chappathi, Dal Tadka, White Rice, Sambar, Curd, Milk', popularity: 7, veg: true },
    { id: 'm-girls-25', section: 'Girls', day: 'Sunday', meal: 'Breakfast', items: 'Idly, Sambar, Coconut Chutney, Vadai, Halwa, Coffee/Tea', popularity: 9, veg: true },
    { id: 'm-girls-26', section: 'Girls', day: 'Sunday', meal: 'Lunch', items: 'Paneer Biryani (Veg) OR Veg Biryani, Raitha, Brinjal Gravy, Ice Cream', popularity: 9, veg: true },
    { id: 'm-girls-27', section: 'Girls', day: 'Sunday', meal: 'Snacks', items: 'Veg Puffs, Hot Tea/Milk', popularity: 8, veg: true },
    { id: 'm-girls-28', section: 'Girls', day: 'Sunday', meal: 'Dinner', items: 'Uthappam, Sambar, Chutney, Fried Rice, Tomato Sauce, Milk', popularity: 8, veg: true }
  ],
  waste: [
    { id: 'w1', section: 'Boys', date: '2026-07-25', meal: 'Breakfast', menuItem: 'Idly, Vadai, Sambar', cookedMeals: 600, actualDiners: 560, preConsumerWaste: 8, postConsumerWaste: 21 },
    { id: 'w2', section: 'Boys', date: '2026-07-25', meal: 'Lunch', menuItem: 'White Rice, Sambar, Poriyal', cookedMeals: 650, actualDiners: 625, preConsumerWaste: 10, postConsumerWaste: 29 },
    { id: 'w3', section: 'Boys', date: '2026-07-25', meal: 'Dinner', menuItem: 'Chappathi, Fried Rice', cookedMeals: 550, actualDiners: 520, preConsumerWaste: 6, postConsumerWaste: 19 },
    { id: 'w4', section: 'Girls', date: '2026-07-25', meal: 'Breakfast', menuItem: 'Idly, Vadai, Sambar', cookedMeals: 600, actualDiners: 560, preConsumerWaste: 7, postConsumerWaste: 21 },
    { id: 'w5', section: 'Girls', date: '2026-07-25', meal: 'Lunch', menuItem: 'White Rice, Sambar, Poriyal', cookedMeals: 650, actualDiners: 625, preConsumerWaste: 10, postConsumerWaste: 29 },
    { id: 'w6', section: 'Girls', date: '2026-07-25', meal: 'Dinner', menuItem: 'Chappathi, Fried Rice', cookedMeals: 550, actualDiners: 520, preConsumerWaste: 6, postConsumerWaste: 19 },
    { id: 'w7', section: 'Boys', date: '2026-07-26', meal: 'Breakfast', menuItem: 'Pongal, Sambar', cookedMeals: 600, actualDiners: 590, preConsumerWaste: 9, postConsumerWaste: 12 },
    { id: 'w8', section: 'Boys', date: '2026-07-26', meal: 'Lunch', menuItem: 'Veg Biryani, Chips', cookedMeals: 700, actualDiners: 695, preConsumerWaste: 5, postConsumerWaste: 14 },
    { id: 'w9', section: 'Boys', date: '2026-07-26', meal: 'Dinner', menuItem: 'Parotta, Paneer Curry', cookedMeals: 600, actualDiners: 597, preConsumerWaste: 4, postConsumerWaste: 16 },
    { id: 'w10', section: 'Girls', date: '2026-07-26', meal: 'Breakfast', menuItem: 'Pongal, Sambar', cookedMeals: 600, actualDiners: 590, preConsumerWaste: 9, postConsumerWaste: 13 },
    { id: 'w11', section: 'Girls', date: '2026-07-26', meal: 'Lunch', menuItem: 'Veg Biryani, Chips', cookedMeals: 700, actualDiners: 695, preConsumerWaste: 5, postConsumerWaste: 14 },
    { id: 'w12', section: 'Girls', date: '2026-07-26', meal: 'Dinner', menuItem: 'Parotta, Paneer Curry', cookedMeals: 600, actualDiners: 597, preConsumerWaste: 4, postConsumerWaste: 16 }
  ],
  feedback: [
    { id: 'f1', section: 'Boys', userId: '2', rollNo: '221CS101', name: 'Aravind Kumar', mealId: 'm-boys-1', date: '2026-07-28', rating: 4, comment: 'Idli was very soft, sambar was good.' },
    { id: 'f2', section: 'Girls', userId: '3', rollNo: '221IT202', name: 'Dharshini R', mealId: 'm-girls-13', date: '2026-07-28', rating: 2, comment: 'Upma is too dry, too much waste.' },
    { id: 'f3', section: 'Boys', userId: '4', rollNo: '221EC303', name: 'Sanjay S', mealId: 'm-boys-26', date: '2026-07-28', rating: 5, comment: 'Sunday Biryani is outstanding! Keep it up!' }
  ],
  announcements: [
    { id: 'a1', date: '2026-07-29', title: 'Separate Boys & Girls Mess Active', content: 'Hostel mess operations have been separated into Boys and Girls sections. Admin can post menu polls that students vote on.', category: 'important' },
    { id: 'a2', date: '2026-07-28', title: 'Food Waste Initiative', content: 'We successfully reduced dinner food waste by 25% this week! Keep cooperating.', category: 'info' }
  ],
  polls: [
    { id: 'p1', section: 'Boys', targetDate: '2026-08-10', meal: 'Lunch', status: 'open', options: [{ id: 'opt1', name: 'Chole Bhature', votes: ['221CS101'] }, { id: 'opt2', name: 'Masala Dosa', votes: ['221EC303'] }, { id: 'opt3', name: 'Paneer Fried Rice', votes: [] }], winner: '', createdAt: new Date().toISOString() },
    { id: 'p2', section: 'Girls', targetDate: '2026-08-11', meal: 'Dinner', status: 'open', options: [{ id: 'opt1', name: 'Veg Hakka Noodles', votes: ['221IT202'] }, { id: 'opt2', name: 'Pav Bhaji', votes: [] }], winner: '', createdAt: new Date().toISOString() }
  ],
  notifications: [
    { id: 'n1', section: 'Boys', studentRollNo: 'All', message: 'Welcome to the Boys Mess Section! Check the Food Change Polls to vote on menu alterations.', createdAt: new Date().toISOString() },
    { id: 'n2', section: 'Girls', studentRollNo: 'All', message: 'Welcome to the Girls Mess Section! Check the Food Change Polls to vote on menu alterations.', createdAt: new Date().toISOString() }
  ],
  reservations: [
    { id: 'r-seed-1', userId: '2', rollNo: '221CS101', name: 'Aravind Kumar', section: 'Boys', hostel: 'Kaveri Hostel (Block A)', messType: 'Veg', date: new Date().toISOString().split('T')[0], meal: 'Dinner', status: 'pending', reason: 'Exam preparation', createdAt: new Date().toISOString() }
  ]
};

// Ensure data directory exists asynchronously
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

// In-memory collection cache for performance
const memoryCache = new Map();

export const readCollectionAsync = async (collectionName) => {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, `${collectionName}.json`);

  if (!existsFs.existsSync(filePath)) {
    const initialData = SEED_DATA[collectionName] || [];
    await writeCollectionAtomic(filePath, initialData);
    memoryCache.set(collectionName, initialData);
    return initialData;
  }

  try {
    const rawData = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(rawData);

    // Migration logic for legacy plain-text passwords
    if (collectionName === 'users' && Array.isArray(parsed)) {
      let modified = false;
      parsed.forEach(user => {
        if (user.password && !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
          user.password = bcrypt.hashSync(user.password, 10);
          modified = true;
        }
      });
      if (modified) {
        await writeCollectionAtomic(filePath, parsed);
      }
    }

    memoryCache.set(collectionName, parsed);
    return parsed;
  } catch (error) {
    console.error(`Error asynchronously reading database file ${filePath}:`, error);
    return memoryCache.get(collectionName) || SEED_DATA[collectionName] || [];
  }
};

// Atomic write to prevent file corruption under concurrent writes
async function writeCollectionAtomic(filePath, data) {
  const tempPath = `${filePath}.${Date.now()}.${Math.floor(Math.random() * 10000)}.tmp`;
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(tempPath, content, 'utf-8');
  await fs.rename(tempPath, filePath);
}

export const saveCollectionAsync = async (collectionName, data) => {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, `${collectionName}.json`);
  try {
    await writeCollectionAtomic(filePath, data);
    memoryCache.set(collectionName, data);
    return true;
  } catch (error) {
    console.error(`Error asynchronously writing database file ${filePath}:`, error);
    return false;
  }
};

export const insertRecordAsync = async (collectionName, record) => {
  const collection = await readCollectionAsync(collectionName);
  const newRecord = {
    id: `${collectionName.charAt(0)}${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ...record
  };
  collection.push(newRecord);
  await saveCollectionAsync(collectionName, collection);
  return newRecord;
};

export const updateRecordAsync = async (collectionName, id, updates) => {
  const collection = await readCollectionAsync(collectionName);
  const index = collection.findIndex(item => item.id === id);
  if (index === -1) return null;

  collection[index] = { ...collection[index], ...updates };
  await saveCollectionAsync(collectionName, collection);
  return collection[index];
};

export const deleteRecordAsync = async (collectionName, id) => {
  const collection = await readCollectionAsync(collectionName);
  const index = collection.findIndex(item => item.id === id);
  if (index === -1) return false;

  collection.splice(index, 1);
  await saveCollectionAsync(collectionName, collection);
  return true;
};
