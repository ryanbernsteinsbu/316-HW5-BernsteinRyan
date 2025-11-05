import { beforeAll, beforeEach, afterEach, afterAll, expect, test } from 'vitest';
import mongoose from 'mongoose';
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
const dbm = require("../db/index.js");
/**
 * Vitest test script for the Playlister app's Mongo Database Manager. Testing should verify that the Mongo Database Manager 
 * will perform all necessarily operations properly.
 *  
 * Scenarios we will test:
 *  1) Reading a User from the database
 *  2) Creating a User in the database
 *  3) ...
 * 
 * You should add at least one test for each database interaction. In the real world of course we would do many varied
 * tests for each interaction.
 */

/**
 * Executed once before all tests are performed.
 */
beforeAll(async () => {
});

/**
 * Executed before each test is performed.
 */
beforeEach(() => {
});

/**
 * Executed after each test is performed.
 */
afterEach(() => {
});

/**
 * Executed once after all tests are performed.
 */
afterAll( () => {
    // await dbm.connection.close();
});
let createdUser = null;
let createdPlaylist = null; 
test('Test #1) Create User', async () => {
    const testUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        passwordHash: 'hashedPassword123',
    };

    createdUser = await dbm.createUser(testUser);
    expect(createdUser).not.toBeNull();
    expect(createdUser.email).toBe(testUser.email);
});

/**
 * Test #2: Reading a User
 */
test('Test #2) Read User', async () => {
    const user = await dbm.findUser('testuser@example.com');
    expect(user).not.toBeNull();
    expect(user.firstName).toBe('Test');
});

/**
 * Test #3: Create Playlist
 */
test('Test #3) Create Playlist', async () => {
  const testPlaylist = {
    name: 'Test Playlist',
    songs: [],
    ownerEmail: 'testuser@example.com'
  };

  createdPlaylist = await dbm.createPlaylist(testPlaylist, createdUser._id || createdUser.email);
  expect(createdPlaylist).not.toBeNull();
  expect(createdPlaylist.name).toBe('Test Playlist');
});

/**
 * Test #4: Get Playlist by ID
 */
test('Test #4) Read Playlist', async () => {
  const playlist = await dbm.getPlaylist(createdPlaylist._id);
  expect(playlist).not.toBeNull();
  expect(playlist.name).toBe('Test Playlist');
});

/**
 * Test #5: Replace Playlist
 */
test('Test #5) Update Playlist', async () => {
  const updatedData = {
    playlist: {
      name: 'Updated Playlist',
      songs: [{ title: 'New Song' }]
    }
  };

  const result = await dbm.replacePlaylist(createdPlaylist._id, updatedData);
  expect(result).toBe(true);

  const updated = await dbm.getPlaylist(createdPlaylist._id);
  expect(updated.name).toBe('Updated Playlist');
});

/**
 * Test #6: Delete Playlist
 */
test('Test #6) Delete Playlist', async () => {
  const deleted = await dbm.deletePlaylist(createdPlaylist._id);
  expect(deleted).toBe(true);

  const afterDelete = await dbm.getPlaylist(createdPlaylist._id);
  expect(afterDelete).toBeNull();
});
// THE REST OF YOUR TEST SHOULD BE PUT BELOW
