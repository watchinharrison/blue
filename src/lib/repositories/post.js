class PostRepository {
	constructor({ db }) {
		this.db = db;
	}

	async create(post) {
		const { text, user_id, reply_id, thread_id } = post;
		return this.db
			.prepare('INSERT INTO posts (text, user_id, reply_id, thread_id) VALUES (?, ?, ?, ?)')
			.bind(text, user_id, reply_id, thread_id)
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
				'SELECT p.*, u.id as user_id, u.display_name, u.username, u.profile_image_url, u.header_image_url FROM posts p INNER JOIN users as u ON p.user_id = u.id ORDER BY p.created_at DESC LIMIT 20'
			)
			.all()
			.catch((error) => {
				console.log('Error fetching posts', error);
				return {
					results: []
				};
			});

		return data.results.map(
			({ user_id, display_name, username, profile_image_url, header_image_url, ...post }) => {
				return {
					...post,
					user: {
						id: user_id,
						profile_image_url,
						header_image_url,
						display_name,
						username
					}
				};
			}
		);
	}

	async findByFollowers(user_id) {
		const data = await this.db
			.prepare(
				'SELECT p.*, u.id as user_id, u.display_name, u.username, u.profile_image_url, u.header_image_url FROM posts p INNER JOIN users as u ON p.user_id = u.id WHERE p.user_id = ? OR p.user_id IN (SELECT follower_id FROM followers WHERE user_id = ?) ORDER BY p.created_at DESC LIMIT 20'
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

		return data.results.map(
			({ user_id, display_name, username, profile_image_url, header_image_url, ...post }) => {
				return {
					...post,
					user: {
						id: user_id,
						profile_image_url,
						header_image_url,
						display_name,
						username
					}
				};
			}
		);
	}

	async search(query) {
		const data = await this.db
			.prepare(
				'SELECT p.*, u.id as user_id, u.display_name, u.username, u.profile_image_url, u.header_image_url FROM posts p INNER JOIN users as u ON p.user_id = u.id WHERE p.text LIKE ? ORDER BY p.created_at DESC LIMIT 20'
			)
			.bind(`%${query}%`)
			.all()
			.catch((error) => {
				console.log('Error fetching posts', error);
			});

		return data.results.map(
			({ user_id, display_name, username, profile_image_url, header_image_url, ...post }) => {
				return {
					...post,
					user: {
						id: user_id,
						profile_image_url,
						header_image_url,
						display_name,
						username
					}
				};
			}
		);
	}

	async getReplies(post_id) {
		const data = await this.db
			.prepare(
				'SELECT p.*, u.id as user_id, u.display_name, u.username, u.profile_image_url, u.header_image_url FROM posts p INNER JOIN users as u ON p.user_id = u.id WHERE p.reply_id = ? ORDER BY p.created_at DESC LIMIT 20'
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
				return [];
			});

		return data.results.map(
			({ user_id, display_name, username, profile_image_url, header_image_url, ...post }) => {
				return {
					...post,
					user: {
						id: user_id,
						profile_image_url,
						header_image_url,
						display_name,
						username
					}
				};
			}
		);
	}

	async getThreadCount(post_id) {
		const data = await this.db
			.prepare('SELECT COUNT(*) as count FROM posts WHERE thread_id = ? AND reply_id IS NOT NULL')
			.bind(post_id)
			.all()
			.catch((error) => {
				console.log('Error fetching posts', error);
				return 0;
			});

		return data?.results[0].count;
	}

	async findByThreadId(post_id) {
		const data = await this.db
			.prepare(
				'SELECT p.*, u.id as user_id, u.display_name, u.username, u.profile_image_url, u.header_image_url FROM posts p INNER JOIN users as u ON p.user_id = u.id WHERE p.thread_id = ? ORDER BY p.created_at ASC LIMIT 20'
			)
			.bind(post_id)
			.all()
			.catch((error) => {
				console.log('Error fetching posts', error);
				if (error.message.includes('no such table')) {
					return this.setupTable().then(() => {
						return this.findByThreadId(post_id);
					});
				}
			});

		return data.results.map(
			({ user_id, display_name, username, profile_image_url, header_image_url, ...post }) => {
				return {
					...post,
					user: {
						id: user_id,
						profile_image_url,
						header_image_url,
						display_name,
						username
					}
				};
			}
		);
	}

	async getReposts(post_id) {
		const data = await this.db
			.prepare(
				'SELECT p.*, u.id as user_id, u.display_name, u.username, u.profile_image_url, u.header_image_url FROM posts p INNER JOIN users as u ON p.user_id = u.id WHERE p.thread_id = ? AND p.reply_id IS NULL ORDER BY p.created_at DESC LIMIT 20'
			)
			.bind(post_id)
			.all()
			.catch((error) => {
				console.log('Error fetching posts', error);
				return [];
			});

		return data.results;
	}

	async findById(id) {
		const { user_id, display_name, username, profile_image_url, header_image_url, ...post } =
			await this.db
				.prepare(
					'SELECT p.*, u.id as user_id, u.display_name, u.username, u.profile_image_url, u.header_image_url FROM posts p INNER JOIN users u ON u.id = p.user_id WHERE p.id = ?'
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
				id: user_id,
				profile_image_url,
				header_image_url,
				display_name,
				username
			}
		};
	}

	async findByUsername(username) {
		const data = await this.db
			.prepare(
				'SELECT p.*, u.id as user_id, u.display_name, u.username, u.profile_image_url, u.header_image_url FROM posts p INNER JOIN users u ON u.id = p.user_id WHERE u.username = ? ORDER BY p.created_at DESC LIMIT 20'
			)
			.bind(username)
			.all()
			.catch((error) => {
				console.log('Error fetching posts', error);
				return {
					results: []
				};
			});

		return data.results.map(
			({ user_id, display_name, username, profile_image_url, header_image_url, ...post }) => {
				return {
					...post,
					user: {
						id: user_id,
						profile_image_url,
						header_image_url,
						display_name,
						username
					}
				};
			}
		);
	}

	async findByUserId(user_id) {
		const data = await this.db
			.prepare(
				'SELECT p.*, u.id as user_id, u.display_name, u.username, u.profile_image_url, u.header_image_url FROM posts p INNER JOIN users u ON u.id = p.user_id WHERE u.id = ? ORDER BY p.created_at DESC LIMIT 20'
			)
			.bind(user_id)
			.all()
			.catch((error) => {
				console.log('Error fetching posts', error);
				return {
					results: []
				};
			});

		return data.results.map(
			({ user_id, display_name, username, profile_image_url, header_image_url, ...post }) => {
				return {
					...post,
					user: {
						id: user_id,
						profile_image_url,
						header_image_url,
						display_name,
						username
					}
				};
			}
		);
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

	async addReply(post_id) {
		return this.db
			.prepare('UPDATE posts SET reply_count = reply_count + 1 WHERE id = ?')
			.bind(post_id)
			.run()
			.catch((error) => {
				console.log('Error adding like', error);
				return null;
			});
	}

	async addRepost(post_id) {
		return this.db
			.prepare('UPDATE posts SET reposts_count = reposts_count + 1 WHERE id = ?')
			.bind(post_id)
			.run()
			.catch((error) => {
				console.log('Error adding like', error);
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
			reply_count INTEGER DEFAULT 0,
			likes_count INTEGER DEFAULT 0,
			reposts_count INTEGER DEFAULT 0,
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
