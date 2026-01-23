class Favorite {
  constructor(row) {
    this.id = row.id;
    this.userId = row.userId;
    this.videoId = row.videoId;
    this.title = row.title;
    this.thumbnailUrl = row.thumbnailUrl;
    this.createdAt = row.createdAt;
  }
}

module.exports = Favorite;
