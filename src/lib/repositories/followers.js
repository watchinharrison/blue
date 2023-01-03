class FollowersRepository {
	constructor({ db }) {
		this.db = db;
	}

	async getFollowers({ userId }) {
		const followers = await this.db
			.prepare(`SELECT * FROM followers WHERE follower_id = ?`)
			.bind(userId)
			.all()
			.catch((error) => {
				console.log('Error fetching followers', error);
				if (error.message.includes('no such table')) {
					return this.setupTable().then(() => {
						return this.getFollowers({ userId });
					});
				}
			});

		return followers?.results;
	}

	async getFollowing({ userId }) {
		const following = await this.db
			.prepare(`SELECT * FROM followers WHERE user_id = ?`)
			.bind(userId)
			.all()
			.catch((error) => {
				console.log('Error fetching following', error);
				return null;
			});

		return following?.results;
	}

	async isFollowing({ followerId, followedId }) {
		const following = await this.db
			.prepare(`SELECT * FROM followers WHERE user_id = ? AND follower_id = ?`)
			.bind(followerId, followedId)
			.first()
			.catch((error) => {
				console.log('Error fetching following', error);
				return null;
			});

		return following;
	}

	async create({ followerId, followedId }) {
		return this.db
			.prepare(`INSERT INTO followers (user_id, follower_id) VALUES (?, ?)`)
			.bind(followerId, followedId)
			.run()
			.catch((error) => {
				console.log('Error creating follower', error);
				if (error.message.includes('no such table')) {
					return this.setupTable().then(() => {
						return this.create({ followerId, followedId });
					});
				}
			});
	}

	async delete({ followerId, followedId }) {
		return this.db
			.prepare(`DELETE FROM followers WHERE user_id = ? AND follower_id = ?`)
			.bind(followerId, followedId)
			.run()
			.catch((error) => {
				console.log('Error deleting follower', error);
				return null;
			});
	}

	async setupTable() {
		return this.db
			.prepare(
				`
      CREATE TABLE IF NOT EXISTS followers (
        user_id INTEGER NOT NULL,
        follower_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (follower_id) REFERENCES users (id),
        PRIMARY KEY (user_id, follower_id)
      )
    `
			)
			.run()
			.catch((tableError) => {
				console.log('tableError', tableError);
			});
	}
}

export default FollowersRepository;
