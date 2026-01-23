const db = require("../config/db");
const Favorite = require("./favorite");

class FavoriteRepository {
  async getByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM Favorites WHERE userId = ? ORDER BY datetime(createdAt) DESC`,
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve((rows || []).map((r) => new Favorite(r)));
        }
      );
    });
  }

  async exists(userId, videoId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id FROM Favorites WHERE userId = ? AND videoId = ?`,
        [userId, videoId],
        (err, row) => {
          if (err) return reject(err);
          resolve(!!row);
        }
      );
    });
  }

  async add({ userId, videoId, title, thumbnailUrl }) {
    const createdAt = new Date().toISOString();

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO Favorites (userId, videoId, title, thumbnailUrl, createdAt)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, videoId, title, thumbnailUrl, createdAt],
        function (err) {
          if (err) return reject(err);
          resolve(
            new Favorite({
              id: this.lastID,
              userId,
              videoId,
              title,
              thumbnailUrl,
              createdAt,
            })
          );
        }
      );
    });
  }

  async removeById({ userId, id }) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM Favorites WHERE id = ? AND userId = ?`,
        [id, userId],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes); // 0 or 1
        }
      );
    });
  }

  async removeByVideoId({ userId, videoId }) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM Favorites WHERE videoId = ? AND userId = ?`,
        [videoId, userId],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes); // 0 or 1
        }
      );
    });
  }
}

module.exports = new FavoriteRepository();