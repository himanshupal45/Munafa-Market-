/**
 * Seeder - Pehli baar admin account aur default settings banane ke liye
 * Run: node seeder.js
 */
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const connectDB = require('./config/db')
const User = require('./models/User')
const SiteSetting = require('./models/SiteSetting')
const Game = require('./models/Game')

const seed = async () => {
  await connectDB()

  // Admin user
  const existingAdmin = await User.findOne({ mobile: '9999999999' })
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      mobile: '9999999999',
      password: 'admin123',
      role: 'admin',
      userId: 'ADMIN001',
      status: 'Active',
    })
    console.log('✅ Admin created: mobile=9999999999, password=admin123')
  } else {
    console.log('ℹ️  Admin already exists')
  }

  // Default site settings
  const settings = await SiteSetting.findOne()
  if (!settings) {
    await SiteSetting.create({
      siteName: 'Munafa',
      minDeposit: 100,
      maxDeposit: 50000,
      minWithdraw: 200,
      maxWithdraw: 50000,
      registrationBonus: 20,
      referralBonus: 50,
    })
    console.log('✅ Default site settings created')
  }

  // Default games
  const gamesCount = await Game.countDocuments()
  if (gamesCount === 0) {
    await Game.insertMany([
      { name: 'FARIDABAD', code: 'FB', openTime: '06:30 PM', status: 'Active' },
      { name: 'GHAZIABAD', code: 'GB', openTime: '09:45 PM', status: 'Active' },
      { name: 'GALI', code: 'GL', openTime: '11:45 PM', status: 'Active' },
      { name: 'DISAWAR', code: 'DW', openTime: '05:30 AM', status: 'Active' },
    ])
    console.log('✅ Default games created')
  }

  console.log('🎉 Seeding complete!')
  process.exit()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
