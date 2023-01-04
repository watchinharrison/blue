class PostRepository {
	constructor({ db }) {
		this.db = db;
	}

	async create(post) {
		const { text, user_id, post_id, thread_id } = post;
		return this.db
			.prepare('INSERT INTO posts (text, user_id, reply_id, thread_id) VALUES (?, ?, ?, ?)')
			.bind(text, user_id, post_id, thread_id)
			.run()
			.catch((error) => {
				console.log('Error creating post', error);
				if (error.message.includes('no such table')) {
					return this.setupTable().then(() => {
						return this.create(post);
					});
				}
				return null;
			});
	}

	async findAll() {
		const data = await this.db
			.prepare(
				'SELECT p.*, u.first_name, u.last_name, u.username FROM posts p INNER JOIN users as u ON p.user_id = u.id ORDER BY p.created_at DESC'
			)
			.all()
			.catch((error) => {
				console.log('Error fetching posts', error);
				return {
					results: []
				};
			});

		return data.results.map(({ first_name, last_name, username, ...post }) => {
			return {
				...post,
				user: {
					profile_image_url: 'https://loremflickr.com/50/50',
					first_name: first_name,
					last_name: last_name,
					username: username
				}
			};
		});
	}

	async findByFollowers(user_id) {
		const data = await this.db
			.prepare(
				'SELECT p.*, u.first_name, u.last_name, u.username, l.created_at as liked FROM posts p INNER JOIN users as u ON p.user_id = u.id LEFT JOIN likes l ON l.post_id = p.id AND l.user_id = u.id WHERE p.user_id = ? OR p.user_id IN (SELECT follower_id FROM followers WHERE user_id = ?) ORDER BY p.created_at DESC'
			)
			.bind(user_id, user_id)
			.all()
			.catch((error) => {
				console.log('Error fetching posts', error);
				if (error.message.includes('no such table')) {
					return this.setupTable().then(() => {
						return this.findByFollowers(user_id);
					});
				}
			});

		return data.results.map(({ first_name, last_name, username, ...post }) => {
			return {
				...post,
				user: {
					profile_image_url: 'https://loremflickr.com/50/50',
					first_name: first_name,
					last_name: last_name,
					username: username
				}
			};
		});
	}

	async getReplies(post_id) {
		const data = await this.db
			.prepare(
				'SELECT p.*, u.first_name, u.last_name, u.username, l.created_at as liked FROM posts p INNER JOIN users as u ON p.user_id = u.id LEFT JOIN likes l ON l.post_id = p.id AND l.user_id = u.id WHERE p.reply_id = ? ORDER BY p.created_at DESC'
			)
			.bind(post_id)
			.all()
			.catch((error) => {
				console.log('Error fetching posts', error);
				if (error.message.includes('no such table')) {
					return this.setupTable().then(() => {
						return this.getReplies(post_id);
					});
				}
			});

		return data.results.map(({ first_name, last_name, username, ...post }) => {
			return {
				...post,
				user: {
					profile_image_url: 'https://loremflickr.com/50/50',
					first_name: first_name,
					last_name: last_name,
					username: username
				}
			};
		});
	}

	async getThread(post_id) {
		const data = await this.db
			.prepare(
				'SELECT p.*, u.first_name, u.last_name, u.username, l.created_at as liked FROM posts p INNER JOIN users as u ON p.user_id = u.id LEFT JOIN likes l ON l.post_id = p.id AND l.user_id = u.id WHERE p.id = ? OR p.thread_id = ? ORDER BY p.created_at DESC'
			)
			.bind(post_id, post_id)
			.all()
			.catch((error) => {
				console.log('Error fetching posts', error);
				if (error.message.includes('no such table')) {
					return this.setupTable().then(() => {
						return this.getThread(post_id);
					});
				}
			});

		return data.results.map(({ first_name, last_name, username, ...post }) => {
			return {
				...post,
				user: {
					profile_image_url: 'https://loremflickr.com/50/50',
					first_name: first_name,
					last_name: last_name,
					username: username
				}
			};
		});
	}

	async findById(id) {
		const { first_name, last_name, username, ...post } = await this.db
			.prepare(
				'SELECT p.*, u.first_name, u.last_name, u.username, l.created_at as liked FROM posts p INNER JOIN users u ON u.id = p.user_id LEFT JOIN likes l ON l.post_id = p.id AND l.user_id = u.id WHERE p.id = ?'
			)
			.bind(id)
			.first()
			.catch((error) => {
				console.log('Error fetching post', error);
				return null;
			});
		return {
			...post,
			user: {
				profile_image_url: 'https://loremflickr.com/50/50',
				first_name: first_name,
				last_name: last_name,
				username: username
			}
		};
	}

	async findByUsername(username) {
		const data = await this.db
			.prepare(
				'SELECT p.*, u.first_name, u.last_name, u.username FROM posts p INNER JOIN users u ON u.id = p.user_id WHERE u.username = ? ORDER BY p.created_at DESC'
			)
			.bind(username)
			.all()
			.catch((error) => {
				console.log('Error fetching posts', error);
				return {
					results: []
				};
			});

		return data.results.map(({ first_name, last_name, username, ...post }) => {
			return {
				...post,
				user: {
					profile_image_url: 'https://loremflickr.com/50/50',
					first_name: first_name,
					last_name: last_name,
					username: username
				}
			};
		});
	}

	async addLike(post_id) {
		return this.db
			.prepare('UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?')
			.bind(post_id)
			.run()
			.catch((error) => {
				console.log('Error adding like', error);
				return null;
			});
	}

	async removeLike(post_id) {
		return this.db
			.prepare('UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?')
			.bind(post_id)
			.run()
			.catch((error) => {
				console.log('Error removing like', error);
				return null;
			});
	}

	async setupTable() {
		return this.db
			.prepare(
				`CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY,
      text TEXT NULL,
      user_id INTEGER,
			likes_count INTEGER DEFAULT 0,
			reply_id INTEGER NULL,
			thread_id INTEGER NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NULL,
			FOREIGN KEY (reply_id) REFERENCES posts (id),
			FOREIGN KEY (thread_id) REFERENCES posts (id)
    )`
			)
			.run()
			.catch((tableError) => {
				console.log('tableError', tableError);
			});
	}
}

export default PostRepository;
