class LikesRepository {
	constructor({ db }) {
		this.db = db;
	}

	async create({ userId, postId }) {
		return this.db
			.prepare(`INSERT INTO likes (user_id, post_id) VALUES (?, ?)`)
			.bind(userId, postId)
			.run()
			.catch((error) => {
				console.log('Error creating like', error);
				return null;
			});
	}

	async delete({ userId, postId }) {
		return this.db
			.prepare(`DELETE FROM likes WHERE user_id = ? AND post_id = ?`)
			.bind(userId, postId)
			.run()
			.catch((error) => {
				console.log('Error deleting like', error);
				return null;
			});
	}

	async getLikes({ postId }) {
		const likes = await this.db
			.prepare(`SELECT * FROM likes WHERE post_id = ?`)
			.bind(postId)
			.all()
			.catch((error) => {
				console.log('Error fetching likes', error);
				return null;
			});
		return likes;
	}

	async getIsPostLiked({ postId, userId }) {
		const isPostLiked = await this.db
			.prepare(`SELECT * FROM likes WHERE post_id = ? AND user_id = ?`)
			.bind(postId, userId)
			.first()
			.catch((error) => {
				console.log('Error fetching likes', error);
				return null;
			});
		return isPostLiked;
	}

	async setupTable() {
		return this.db
			.prepare(
				`CREATE TABLE
          likes (
            user_id INTEGER NOT NULL,
            post_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (post_id) REFERENCES posts (id),
            PRIMARY KEY (user_id, post_id)
          )
        `
			)
			.run()
			.catch((tableError) => {
				console.log('tableError', tableError);
			});
	}
}

export default LikesRepository;
